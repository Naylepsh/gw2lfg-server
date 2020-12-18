import { RaidPost } from "@data/entities/raid-post.entitity";
import { LIRequirement } from "@data/entities/requirement.entity";
import { Role } from "@data/entities/role.entity";
import { User } from "@data/entities/user.entity";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { IPostRepository } from "@data/repositories/post/post.repository.interface";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import {
  ConcreteItemsFetcher,
  GetItems,
} from "@services/gw2-api/gw2-api.service";
import { nameToId } from "@services/gw2-items/gw2-items.service";
import { Item } from "@services/gw2-items/item.interface";
import { SendJoinRequestService } from "@services/join-request/send.service";
import { CheckItemRequirementsService } from "@services/requirement/check-item-requirements.service";
import { JoinRequestMemoryRepository } from "@test/helpers/repositories/join-request.memory-repository";
import { RaidPostMemoryRepository } from "@test/helpers/repositories/raid-post.memory-repository";
import { UserMemoryRepository } from "@test/helpers/repositories/user.memory-repository";
import { storage } from "../item-storage";

describe("JoinRequest Service: send tests", () => {
  let userRepo: IUserRepository;
  let postRepo: IPostRepository;
  let joinRequestRepo: IJoinRequestRepository;

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
    const liRequirement = new LIRequirement({ quantity: 1 });
    const role = new Role({ name: "DPS", class: "Any" });
    const post = new RaidPost({
      date: new Date(),
      server: "EU",
      author: user,
      bosses: [],
      requirements: [liRequirement],
      roles: [role],
    });
    await postRepo.save(post);
    const fetchItems = storage(
      new Map<string, Item[]>([
        [apiKey, [{ id: nameToId(LIRequirement.itemName), count: 10 }]],
      ])
    );

    await new SendJoinRequestService(
      userRepo,
      postRepo,
      joinRequestRepo,
      new CheckItemRequirementsService(new GetItems(fetchItems))
    ).sendJoinRequest({ userId: user.id, postId: post.id, roleId: role.id });

    const request = await joinRequestRepo.findByKey(user.id, post.id, role.id);
    expect(request).toBeDefined();
  });

  it("should throw an error if user does not exists", async () => {
    const userId = 1;
    const postId = 2;
    const roleId = 1;

    expect(
      new SendJoinRequestService(
        userRepo,
        postRepo,
        joinRequestRepo,
        new CheckItemRequirementsService(new DummyItemFetcher())
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

    expect(
      new SendJoinRequestService(
        userRepo,
        postRepo,
        joinRequestRepo,
        new CheckItemRequirementsService(new DummyItemFetcher())
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
    const liRequirement = new LIRequirement({ quantity: 2 });
    const post = new RaidPost({
      date: new Date(),
      server: "EU",
      author: user,
      bosses: [],
      requirements: [liRequirement],
    });
    const roleId = 3;

    expect(
      new SendJoinRequestService(
        userRepo,
        postRepo,
        joinRequestRepo,
        new CheckItemRequirementsService(new DummyItemFetcher())
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
    const liRequirement = new LIRequirement({ quantity: 2 });
    const role = new Role({ name: "DPS", class: "Any" });
    role.id = 1;
    const post = new RaidPost({
      date: new Date(),
      server: "EU",
      author: user,
      bosses: [],
      requirements: [liRequirement],
      roles: [role],
    });
    await postRepo.save(post);
    const fetchItems = storage(
      new Map<string, Item[]>([
        [apiKey, [{ id: nameToId(LIRequirement.itemName), count: 1 }]],
      ])
    );

    expect(
      new SendJoinRequestService(
        userRepo,
        postRepo,
        joinRequestRepo,
        new CheckItemRequirementsService(new GetItems(fetchItems))
      ).sendJoinRequest({ userId: user.id, postId: post.id, roleId: role.id })
    ).rejects.toThrow();
  });
});

class DummyItemFetcher implements ConcreteItemsFetcher {
  fetch(_ids: string[], _apiKey: string): Promise<Item[]> {
    return new Promise((resolve) => resolve([]));
  }
}
