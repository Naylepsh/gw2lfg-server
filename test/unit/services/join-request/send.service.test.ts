import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { Role } from "@root/data/entities/role/role.entity";
import { User } from "@root/data/entities/user/user.entity";
import { ItemRequirement } from "@root/data/entities/item-requirement/item.requirement.entity";
import { IPostRepository } from "@data/repositories/post/post.repository.interface";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import {
  ItemsFetcher,
  GetItems,
} from "@root/services/gw2-api/items/get-items.gw2-api.service";
import { nameToId } from "@services/gw2-items/gw2-items.service";
import { GW2ApiItem } from "@services/gw2-items/item.interface";
import { SendJoinRequestService } from "@root/services/join-request/send-join-request.service";
import { CheckItemRequirementsService } from "@services/requirement/check-item-requirements.service";
import { JoinRequestMemoryRepository } from "../../../helpers/repositories/join-request.memory-repository";
import { RaidPostMemoryRepository } from "../../../helpers/repositories/raid-post.memory-repository";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";
import { storage } from "../item-storage";
import items from "@services/gw2-items/items.json";
import { CheckRequirementsService } from "@services/requirement/check-requirements.service";
import { FindUserItemsService } from "@services/user/find-user-items.service";

describe("JoinRequest Service: send tests", () => {
  let userRepo: IUserRepository;
  let postRepo: IPostRepository;
  let joinRequestRepo: JoinRequestMemoryRepository;
  const itemReqCheckService = new CheckItemRequirementsService();
  const validItemName = Object.keys(items)[0];

  beforeEach(() => {
    userRepo = new UserMemoryRepository();
    postRepo = new RaidPostMemoryRepository();
    joinRequestRepo = new JoinRequestMemoryRepository();
  });

  it("should save the request if valid data was passed", async () => {
    const apiKey = "api-key";
    const user = await userRepo.save(
      new User({
        username: "username",
        password: "password",
        apiKey,
      })
    );
    const itemRequirement = new ItemRequirement({
      name: validItemName,
      quantity: 1,
    });
    const role = new Role({ name: "DPS", class: "Any" });
    const post = new RaidPost({
      date: new Date(),
      server: "EU",
      author: user,
      bosses: [],
      requirements: [itemRequirement],
      roles: [role],
    });
    await postRepo.save(post);
    const fetchItems = storage(
      new Map<string, GW2ApiItem[]>([
        [apiKey, [{ id: nameToId(itemRequirement.name), count: 10 }]],
      ])
    );

    const findUserItemsService = new FindUserItemsService(
      userRepo,
      new GetItems(fetchItems)
    );

    await new SendJoinRequestService(
      userRepo,
      postRepo,
      joinRequestRepo,
      new CheckRequirementsService(itemReqCheckService, findUserItemsService)
    ).sendJoinRequest({ userId: user.id, postId: post.id, roleId: role.id });

    const request = await joinRequestRepo.findByKeys({
      userId: user.id,
      postId: post.id,
      roleId: role.id,
    });
    expect(request).toBeDefined();
  });

  it("should throw an error if user does not exists", async () => {
    const userId = 1;
    const postId = 2;
    const roleId = 1;

    const findUserItemsService = new FindUserItemsService(
      userRepo,
      new DummyItemFetcher()
    );

    expect(
      new SendJoinRequestService(
        userRepo,
        postRepo,
        joinRequestRepo,
        new CheckRequirementsService(itemReqCheckService, findUserItemsService)
      ).sendJoinRequest({ userId, postId, roleId })
    ).rejects.toThrow();
  });

  it("should throw an error if post does not exists", async () => {
    const user = await userRepo.save(
      new User({
        username: "username",
        password: "password",
        apiKey: "api-key",
      })
    );
    const postId = 2;
    const roleId = 3;

    const findUserItemsService = new FindUserItemsService(
      userRepo,
      new DummyItemFetcher()
    );

    expect(
      new SendJoinRequestService(
        userRepo,
        postRepo,
        joinRequestRepo,
        new CheckRequirementsService(itemReqCheckService, findUserItemsService)
      ).sendJoinRequest({ userId: user.id, postId, roleId })
    ).rejects.toThrow();
  });

  it("should throw an error if post does not contain the role", async () => {
    const user = await userRepo.save(
      new User({
        username: "username",
        password: "password",
        apiKey: "api-key",
      })
    );
    const itemRequirement = new ItemRequirement({
      name: validItemName,
      quantity: 2,
    });
    const post = new RaidPost({
      date: new Date(),
      server: "EU",
      author: user,
      bosses: [],
      requirements: [itemRequirement],
    });
    const roleId = 3;

    const findUserItemsService = new FindUserItemsService(
      userRepo,
      new DummyItemFetcher()
    );

    expect(
      new SendJoinRequestService(
        userRepo,
        postRepo,
        joinRequestRepo,
        new CheckRequirementsService(itemReqCheckService, findUserItemsService)
      ).sendJoinRequest({ userId: user.id, postId: post.id, roleId })
    ).rejects.toThrow();
  });

  it("should throw an error if user does not meet the requirements", async () => {
    const apiKey = "api-key";
    const user = await userRepo.save(
      new User({
        username: "username",
        password: "password",
        apiKey,
      })
    );
    const itemRequirement = new ItemRequirement({
      name: validItemName,
      quantity: 2,
    });
    const role = new Role({ name: "DPS", class: "Any" });
    role.id = 1;
    const post = new RaidPost({
      date: new Date(),
      server: "EU",
      author: user,
      bosses: [],
      requirements: [itemRequirement],
      roles: [role],
    });
    await postRepo.save(post);
    const fetchItems = storage(
      new Map<string, GW2ApiItem[]>([
        [apiKey, [{ id: nameToId(itemRequirement.name), count: 1 }]],
      ])
    );

    const findUserItemsService = new FindUserItemsService(
      userRepo,
      new GetItems(fetchItems)
    );

    expect(
      new SendJoinRequestService(
        userRepo,
        postRepo,
        joinRequestRepo,
        new CheckRequirementsService(itemReqCheckService, findUserItemsService)
      ).sendJoinRequest({ userId: user.id, postId: post.id, roleId: role.id })
    ).rejects.toThrow();
  });

  it("should throw an error if user attempts to join more than once", async () => {
    const apiKey = "api-key";
    const user = await userRepo.save(
      new User({
        username: "username",
        password: "password",
        apiKey,
      })
    );
    const itemRequirement = new ItemRequirement({
      name: validItemName,
      quantity: 1,
    });
    const role = new Role({ name: "DPS", class: "Any" });
    const post = new RaidPost({
      date: new Date(),
      server: "EU",
      author: user,
      bosses: [],
      requirements: [itemRequirement],
      roles: [role],
    });
    await postRepo.save(post);
    const fetchItems = storage(
      new Map<string, GW2ApiItem[]>([
        [apiKey, [{ id: nameToId(itemRequirement.name), count: 10 }]],
      ])
    );
    const findUserItemsService = new FindUserItemsService(
      userRepo,
      new GetItems(fetchItems)
    );
    const service = new SendJoinRequestService(
      userRepo,
      postRepo,
      joinRequestRepo,
      new CheckRequirementsService(itemReqCheckService, findUserItemsService)
    );

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
    const apiKey = "api-key";
    const user = await userRepo.save(
      new User({
        username: "username",
        password: "password",
        apiKey,
      })
    );
    const itemRequirement = new ItemRequirement({
      name: validItemName,
      quantity: 1,
    });
    const role = new Role({ name: "DPS", class: "Any" });
    const post = new RaidPost({
      date: new Date(),
      server: "EU",
      author: user,
      bosses: [],
      requirements: [itemRequirement],
      roles: [role],
    });
    await postRepo.save(post);
    const fetchItems = storage(
      new Map<string, GW2ApiItem[]>([
        [apiKey, [{ id: nameToId(itemRequirement.name), count: 10 }]],
      ])
    );
    const findUserItemsService = new FindUserItemsService(
      userRepo,
      new GetItems(fetchItems)
    );
    const service = new SendJoinRequestService(
      userRepo,
      postRepo,
      joinRequestRepo,
      new CheckRequirementsService(itemReqCheckService, findUserItemsService)
    );
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
});

class DummyItemFetcher implements ItemsFetcher {
  fetch(_ids: number[], _apiKey: string): Promise<GW2ApiItem[]> {
    return new Promise((resolve) => resolve([]));
  }
}
