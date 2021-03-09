import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { Role } from "@root/data/entities/role/role.entity";
import { User } from "@root/data/entities/user/user.entity";
import { ItemRequirement } from "@root/data/entities/item-requirement/item.requirement.entity";
import { IPostRepository } from "@data/repositories/post/post.repository.interface";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { GetItems } from "@root/services/gw2-api/items/get-items.fetcher";
import { nameToId } from "@services/gw2-items/gw2-items.service";
import { GW2ApiItem } from "@services/gw2-items/item.interface";
import { SendJoinRequestService } from "@root/services/join-request/send-join-request.service";
import { JoinRequestMemoryRepository } from "../../../common/repositories/join-request.memory-repository";
import { RaidPostMemoryRepository } from "../../../common/repositories/raid-post.memory-repository";
import { UserMemoryRepository } from "../../../common/repositories/user.memory-repository";
import { storage } from "../item-storage";
import items from "@services/gw2-items/items.json";
import { CheckItemRequirementsService } from "@services/requirement/check-requirements.service";
import { FindUserItemsService } from "@services/user/find-user-items.service";
import { addHours } from "../../../common/hours.util";

class JoinRequestServiceTestObject {
  date: Date;
  item: {
    name: string;
    quantity: number;
  };
  role: {
    name: string;
    class: string;
  };
  itemsInStorage: {
    id: number;
    count: number;
  }[];

  constructor() {
    const validItemName = Object.keys(items)[0];
    this.date = addHours(new Date(), 1);
    this.item = { name: validItemName, quantity: 1 };
    this.role = { name: "Any", class: "Any" };
    this.itemsInStorage = [{ id: nameToId(validItemName), count: 1 }];
  }
}

describe("JoinRequest Service: send tests", () => {
  let userRepo: IUserRepository;
  let postRepo: IPostRepository;
  let joinRequestRepo: JoinRequestMemoryRepository;

  const apiKey = "api-key";
  const user = new User({
    username: "username",
    password: "password",
    apiKey,
  });

  let obj = new JoinRequestServiceTestObject();

  beforeEach(() => {
    resetTestObject();
    userRepo = new UserMemoryRepository();
    postRepo = new RaidPostMemoryRepository();
    joinRequestRepo = new JoinRequestMemoryRepository();
  });

  it("should save the request if valid data was passed", async () => {
    const { post, role, itemRequirement } = await seed();
    setItemsInStorage([{ id: nameToId(itemRequirement.name), count: 10 }]);
    const service = setupSendJoinRequestService();

    service.sendJoinRequest({
      userId: user.id,
      postId: post.id,
      roleId: role.id,
    });

    const request = await joinRequestRepo.findByKeys({
      userId: user.id,
      postId: post.id,
      roleId: role.id,
    });
    expect(request).toBeDefined();
  });

  it("should throw an error if user does not exists", async () => {
    const [userId, postId, roleId] = [-1, 2, 1];
    const service = setupSendJoinRequestService();

    expect(
      service.sendJoinRequest({ userId, postId, roleId })
    ).rejects.toThrow();
  });

  it("should throw an error if post does not exists", async () => {
    const [postId, roleId] = [-1, 1];
    const service = setupSendJoinRequestService();

    expect(
      service.sendJoinRequest({ userId: user.id, postId, roleId })
    ).rejects.toThrow();
  });

  it("should throw an error if post does not contain the role", async () => {
    const { post } = await seed();
    const roleId = 3;
    const service = setupSendJoinRequestService();

    expect(
      service.sendJoinRequest({ userId: user.id, postId: post.id, roleId })
    ).rejects.toThrow();
  });

  it("should throw an error if user does not meet the requirements", async () => {
    setItemRequirementQuantity(100);
    const { post, role, itemRequirement } = await seed();
    setItemsInStorage([{ id: nameToId(itemRequirement.name), count: 1 }]);
    const service = setupSendJoinRequestService();

    expect(
      service.sendJoinRequest({
        userId: user.id,
        postId: post.id,
        roleId: role.id,
      })
    ).rejects.toThrow();
  });

  it("should throw an error if user attempts to join more than once", async () => {
    const { post, role } = await seed();
    const service = setupSendJoinRequestService();

    await service.sendJoinRequest({
      userId: user.id,
      postId: post.id,
      roleId: role.id,
    });

    expect(
      service.sendJoinRequest({
        userId: user.id,
        postId: post.id,
        roleId: role.id,
      })
    ).rejects.toThrow();
  });

  it("should throw an error if user attempts join a taken spot", async () => {
    const { post, role } = await seed();
    const service = setupSendJoinRequestService();

    await service.sendJoinRequest({
      userId: user.id,
      postId: post.id,
      roleId: role.id,
    });
    joinRequestRepo.entities[0].status = "ACCEPTED";
    const differentUser = await userRepo.save(
      new User({
        username: "different-username",
        password: "password",
        apiKey,
      })
    );

    expect(
      service.sendJoinRequest({
        userId: differentUser.id,
        postId: post.id,
        roleId: role.id,
      })
    ).rejects.toThrow();
  });

  function resetTestObject() {
    obj = new JoinRequestServiceTestObject();
  }
  function setItemRequirementQuantity(quantity: number) {
    obj.item.quantity = quantity;
  }
  function setItemsInStorage(items: { id: number; count: number }[]) {
    obj.itemsInStorage = items;
  }

  async function seed() {
    await userRepo.save(user);

    const itemRequirement = new ItemRequirement(obj.item);
    const role = new Role(obj.role);
    const post = new RaidPost({
      date: obj.date,
      server: "EU",
      author: user,
      bosses: [],
      requirements: [itemRequirement],
      roles: [role],
    });
    await postRepo.save(post);

    return { post, itemRequirement, role };
  }

  function setupItemFetcher() {
    const allItemsFetcher = storage(
      new Map<string, GW2ApiItem[]>([[apiKey, obj.itemsInStorage]])
    );

    return new GetItems(allItemsFetcher);
  }

  function setupFindUserItemsService() {
    const itemFetcher = setupItemFetcher();
    return new FindUserItemsService(userRepo, itemFetcher);
  }

  function setupSendJoinRequestService() {
    const findUserItemsService = setupFindUserItemsService();

    return new SendJoinRequestService(
      userRepo,
      postRepo,
      joinRequestRepo,
      new CheckItemRequirementsService(findUserItemsService)
    );
  }
});
