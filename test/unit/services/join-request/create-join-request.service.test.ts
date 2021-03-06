import { ItemRequirement } from "@data/entities/item-requirement/item.requirement.entity";
import { RaidPost } from "@data/entities/raid-post/raid-post.entitity";
import { Role } from "@data/entities/role/role.entity";
import { User } from "@data/entities/user/user.entity";
import { byJoinRequestRelations } from "@data/queries/join-request.queries";
import { IPostRepository } from "@data/repositories/post/post.repository.interface";
import { IRoleRepository } from "@data/repositories/role/role.repository.interface";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { GetItems } from "@services/gw2-api/items/get-items.fetcher";
import { GW2ApiItem } from "@services/gw2-api/items/item.interface";
import { nameToId } from "@services/gw2-api/items/item.utils";
import items from "@services/gw2-api/items/items.json";
import { CreateJoinRequestService } from "@services/join-request/create-join-request.service";
import { CheckItemRequirementsService } from "@services/requirement/check-item-requirements.service";
import { FindUserItemsService } from "@services/user/find-user-items.service";
import { addHours } from "../../../common/hours.util";
import { JoinRequestMemoryRepository } from "../../../common/repositories/join-request.memory-repository";
import { NotificationMemoryRepository } from "../../../common/repositories/notification.memory-repository";
import { RaidPostMemoryRepository } from "../../../common/repositories/raid-post.memory-repository";
import { RoleMemoryRepository } from "../../../common/repositories/role.memory-repository";
import { UserMemoryRepository } from "../../../common/repositories/user.memory-repository";
import { INotificationRepository } from "@data/repositories/notification/notification.repository.interface";
import { CreateNotificationService } from "@services/notification/create-notification.service";
import { storage } from "../item-storage";

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

describe("CreateJoinRequest service tests", () => {
  let userRepo: IUserRepository;
  let roleRepo: IRoleRepository;
  let postRepo: IPostRepository;
  let joinRequestRepo: JoinRequestMemoryRepository;
  let notificationRepo: INotificationRepository;

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
    roleRepo = new RoleMemoryRepository();
    postRepo = new RaidPostMemoryRepository();
    joinRequestRepo = new JoinRequestMemoryRepository();
    notificationRepo = new NotificationMemoryRepository();
  });

  it("should save the request if valid data was passed", async () => {
    const { post, role, itemRequirement } = await seed();
    setItemsInStorage([{ id: nameToId(itemRequirement.name), count: 10 }]);
    const service = setupSendJoinRequestService();

    await service.create({
      userId: user.id,
      postId: post.id,
      roleId: role.id,
    });

    const request = await joinRequestRepo.findOne(
      byJoinRequestRelations({
        userId: user.id,
        postId: post.id,
        roleId: role.id,
      })
    );
    expect(request).toBeDefined();
  });

  it("should throw an error if user does not exists", async () => {
    const [userId, postId, roleId] = [-1, 2, 1];
    const service = setupSendJoinRequestService();

    expect(service.create({ userId, postId, roleId })).rejects.toThrow();
  });

  it("should throw an error if post does not exists", async () => {
    const [postId, roleId] = [-1, 1];
    const service = setupSendJoinRequestService();

    expect(
      service.create({ userId: user.id, postId, roleId })
    ).rejects.toThrow();
  });

  it("should throw an error if post does not contain the role", async () => {
    const { post } = await seed();
    const roleId = 3;
    const service = setupSendJoinRequestService();

    expect(
      service.create({ userId: user.id, postId: post.id, roleId })
    ).rejects.toThrow();
  });

  it("should throw an error if user does not meet the requirements", async () => {
    setItemRequirementQuantity(100);
    const { post, role, itemRequirement } = await seed();
    setItemsInStorage([{ id: nameToId(itemRequirement.name), count: 1 }]);
    const service = setupSendJoinRequestService();

    expect(
      service.create({
        userId: user.id,
        postId: post.id,
        roleId: role.id,
      })
    ).rejects.toThrow();
  });

  it("should throw an error if user attempts to join more than once", async () => {
    const { post, role } = await seed();
    const service = setupSendJoinRequestService();

    await service.create({
      userId: user.id,
      postId: post.id,
      roleId: role.id,
    });

    expect(
      service.create({
        userId: user.id,
        postId: post.id,
        roleId: role.id,
      })
    ).rejects.toThrow();
  });

  it("should throw an error if user attempts join a taken spot", async () => {
    const { post, role } = await seed();
    const service = setupSendJoinRequestService();

    await service.create({
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
      service.create({
        userId: differentUser.id,
        postId: post.id,
        roleId: role.id,
      })
    ).rejects.toThrow();
  });

  it("should notify request creator", async () => {
    const { post, role } = await seed();
    const service = setupSendJoinRequestService();

    await service.create({
      userId: user.id,
      postId: post.id,
      roleId: role.id,
    });
    const requestSender = await userRepo.save(
      new User({
        username: "different-username",
        password: "password",
        apiKey,
      })
    );

    await service.create({
      userId: requestSender.id,
      postId: post.id,
      roleId: role.id,
    });

    const senderNotifications = await notificationRepo.findMany({
      where: { recipent: requestSender.username },
    });
    expect(senderNotifications.length).toBeGreaterThan(0);
  });

  it("should notify post author", async () => {
    const { post, role } = await seed();
    const service = setupSendJoinRequestService();

    await service.create({
      userId: user.id,
      postId: post.id,
      roleId: role.id,
    });
    const requestSender = await userRepo.save(
      new User({
        username: "different-username",
        password: "password",
        apiKey,
      })
    );

    await service.create({
      userId: requestSender.id,
      postId: post.id,
      roleId: role.id,
    });

    const senderNotifications = await notificationRepo.findMany({
      where: { recipent: post.author.username },
    });
    expect(senderNotifications.length).toBeGreaterThan(0);
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
    const role = await roleRepo.save(new Role(obj.role));
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

  function setupSendJoinRequestService() {
    const findUserItemsService = setupFindUserItemsService();
    const notificationService = new CreateNotificationService(notificationRepo);

    return new CreateJoinRequestService(
      userRepo,
      postRepo,
      joinRequestRepo,
      new CheckItemRequirementsService(findUserItemsService),
      notificationService
    );
  }

  function setupFindUserItemsService() {
    const itemFetcher = setupItemFetcher();
    return new FindUserItemsService(userRepo, itemFetcher);
  }

  function setupItemFetcher() {
    const allItemsFetcher = storage(
      new Map<string, GW2ApiItem[]>([[apiKey, obj.itemsInStorage]])
    );

    return new GetItems(allItemsFetcher);
  }
});
