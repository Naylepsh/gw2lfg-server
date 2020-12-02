import "reflect-metadata";
import request from "supertest";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import Container from "typedi";
import { SendRaidJoinRequestController } from "../../../../api/controllers/join-request/send.controller";
import { CurrentUserJWTMiddleware } from "../../../../api/middleware/current-user.middleware";
import { GetItems } from "../../../../services/gw2-api/gw2-api.service";
import { SendJoinRequestService } from "../../../../services/join-request/send.service";
import { JoinRequestMemoryRepository } from "../../../helpers/repositories/join-request.memory-repository";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { MyStorage } from "../../../unit/services/item-storage";
import { RaidPost } from "../../../../data/entities/raid-post.entitity";
import { User } from "../../../../data/entities/user.entity";
import { LIRequirement } from "../../../../data/entities/requirement.entity";
import { nameToId } from "../../../../services/gw2-items/gw2-items.service";
import { Item } from "../../../../services/gw2-items/item.interface";
import { seedDbWithOnePost } from "../raid-post/seed-db";

describe("SendRaidJoinRequestController integration tests", () => {
  let joinRequestRepo: JoinRequestMemoryRepository;
  let app: any;
  let token: string;
  let postId = 0;
  let user: User;
  let myStorage: MyStorage;

  beforeEach(async () => {
    const uow = RaidPostMemoryUnitOfWork.create();

    let post: RaidPost;
    ({ token, post, user } = await seedDbWithOnePost(uow));
    postId = post.id;

    myStorage = new MyStorage(
      new Map<string, Item[]>([
        [user.apiKey, [{ id: nameToId(LIRequirement.itemName), count: 1 }]],
      ])
    );
    joinRequestRepo = new JoinRequestMemoryRepository();
    const sendJoinRequestService = new SendJoinRequestService(
      uow.users,
      uow.raidPosts,
      joinRequestRepo,
      new GetItems(myStorage.fetch.bind(myStorage))
    );
    const controller = new SendRaidJoinRequestController(
      sendJoinRequestService
    );

    Container.set(SendRaidJoinRequestController, controller);
    useContainer(Container);

    const currentUserMiddleware = new CurrentUserJWTMiddleware(uow.users);

    app = createExpressServer({
      controllers: [SendRaidJoinRequestController],
      currentUserChecker: async (action: Action) =>
        await currentUserMiddleware.getCurrentUser(action),
    });
  });

  it("should return 401 if user was not logged in", async () => {
    const res = await request(app).post(toUrl(postId));

    expect(res.status).toBe(401);
  });

  it("should return 404 if post does not exists", async () => {
    const idOfNonExistingPost = 123;

    const res = await request(app)
      .post(toUrl(idOfNonExistingPost))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(404);
  });

  it("should return 403 if user did not meet post requirements", async () => {
    myStorage.items.set(user.apiKey, [
      { id: nameToId(LIRequirement.itemName), count: 0 },
    ]);

    const res = await request(app)
      .post(toUrl(postId))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(403);
  });

  it("should return 422 if user has already sent a request", async () => {
    myStorage.items.set(user.apiKey, [
      { id: nameToId(LIRequirement.itemName), count: 100 },
    ]);

    await request(app)
      .post(toUrl(postId))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);
    const res = await request(app)
      .post(toUrl(postId))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(422);
  });

  it("should return 201 if valid data was passed", async () => {
    myStorage.items.set(user.apiKey, [
      { id: nameToId(LIRequirement.itemName), count: 100 },
    ]);

    const res = await request(app)
      .post(toUrl(postId))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(201);
  });

  it("should save join request if valid data was passed", async () => {
    myStorage.items.set(user.apiKey, [
      { id: nameToId(LIRequirement.itemName), count: 100 },
    ]);

    await request(app)
      .post(toUrl(postId))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    expect(joinRequestRepo.entities.length).toBe(1);
  });

  const toUrl = (id: number) => {
    return `/raid-posts/${id}/join-request`;
  };
});
