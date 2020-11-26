import { RaidPost } from "../../../../entities/raid-post.entitity";
import { LIRequirement } from "../../../../entities/requirement.entity";
import { User } from "../../../../entities/user.entity";
import { IJoinRequestRepository } from "../../../../repositories/join-request.repository";
import { IPostRepository } from "../../../../repositories/post.repository";
import { IUserRepository } from "../../../../repositories/user.repository";
import { getItems } from "../../../../services/gw2-api/gw2-api.service";
import { nameToId } from "../../../../services/gw2-items/gw2-items.service";
import { Item } from "../../../../services/gw2-items/item.interface";
import { sendJoinRequest } from "../../../../services/join-request/send.service";
import { JoinRequestMemoryRepository } from "../../../helpers/repositories/join-request.memory-repository";
import { RaidPostMemoryRepository } from "../../../helpers/repositories/raid-post.memory-repository";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";
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
    const post = new RaidPost({
      date: new Date(),
      server: "EU",
      author: user,
      bosses: [],
      requirements: [liRequirement],
    });
    await postRepo.save(post);
    const fetchItems = storage(
      new Map<string, Item[]>([
        [apiKey, [{ id: nameToId(LIRequirement.itemName), count: 10 }]],
      ])
    );

    await sendJoinRequest(
      user.id,
      post.id,
      userRepo,
      postRepo,
      joinRequestRepo,
      getItems(fetchItems)
    );

    const request = await joinRequestRepo.findByKey(user.id, post.id);
    expect(request).toBeDefined();
  });

  it("should throw an error if user does not exists", async () => {
    const userId = 1;
    const postId = 2;

    expect(
      sendJoinRequest(
        userId,
        postId,
        userRepo,
        postRepo,
        joinRequestRepo,
        dummyItemFetcher
      )
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

    expect(
      sendJoinRequest(
        user.id,
        postId,
        userRepo,
        postRepo,
        joinRequestRepo,
        dummyItemFetcher
      )
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
    const post = new RaidPost({
      date: new Date(),
      server: "EU",
      author: user,
      bosses: [],
      requirements: [liRequirement],
    });
    await postRepo.save(post);
    const fetchItems = storage(
      new Map<string, Item[]>([
        [apiKey, [{ id: nameToId(LIRequirement.itemName), count: 1 }]],
      ])
    );

    expect(
      sendJoinRequest(
        user.id,
        post.id,
        userRepo,
        postRepo,
        joinRequestRepo,
        getItems(fetchItems)
      )
    ).rejects.toThrow();
  });
});

const dummyItemFetcher = (_ids: string[], _apiKey: string): Promise<Item[]> => {
  return new Promise((resolve) => resolve([]));
};
