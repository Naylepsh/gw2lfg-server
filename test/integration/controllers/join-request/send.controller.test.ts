import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import items from "@root/services/gw2-items/items.json";
import { SendRaidJoinRequestController } from "@api/controllers/join-requests/send.controller";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { RaidPost } from "@data/entities/raid-post.entitity";
import { User } from "@data/entities/user.entity";
import { GetItems } from "@services/gw2-api/gw2-api.service";
import { Item } from "@services/gw2-items/item.interface";
import { SendJoinRequestService } from "@root/services/join-request/send-join-request.service";
import { CheckItemRequirementsService } from "@services/requirement/check-item-requirements.service";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import { JoinRequestMemoryRepository } from "../../../helpers/repositories/join-request.memory-repository";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { MyStorage } from "../../../unit/services/item-storage";
import { seedDbWithOnePost } from "../raid-post/seed-db";

describe("SendRaidJoinRequestController integration tests", () => {
  const liId = items["Legendary Insight"];
  let joinRequestRepo: JoinRequestMemoryRepository;
  let app: any;
  let token: string;
  let post: RaidPost;
  let user: User;
  let myStorage: MyStorage;

  beforeEach(async () => {
    const uow = RaidPostMemoryUnitOfWork.create();

    ({ token, post, user } = await seedDbWithOnePost(uow));

    myStorage = new MyStorage(
      new Map<string, Item[]>([[user.apiKey, [{ id: liId, count: 1 }]]])
    );
    const requirementChecker = new CheckItemRequirementsService(
      new GetItems(myStorage.fetch.bind(myStorage))
    );
    joinRequestRepo = new JoinRequestMemoryRepository();
    const sendJoinRequestService = new SendJoinRequestService(
      uow.users,
      uow.raidPosts,
      joinRequestRepo,
      requirementChecker
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
    const res = await request(app)
      .post(toUrl(post.id))
      .send({ roleId: post.roles[0].id });

    expect(res.status).toBe(401);
  });

  it("should return 404 if post does not exists", async () => {
    const idOfNonExistingPost = 123;

    const res = await request(app)
      .post(toUrl(idOfNonExistingPost))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token)
      .send({ roleId: post.roles[0].id });

    expect(res.status).toBe(404);
  });

  it("should return 404 if post does not contain the role", async () => {
    const idOfNonExistingPost = 123;
    const idOfNonExistsingRole = 456;

    const res = await request(app)
      .post(toUrl(idOfNonExistingPost))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token)
      .send({ roleId: idOfNonExistsingRole });

    expect(res.status).toBe(404);
  });

  it("should return 403 if user did not meet post requirements", async () => {
    myStorage.items.set(user.apiKey, [{ id: liId, count: 0 }]);

    const res = await request(app)
      .post(toUrl(post.id))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token)
      .send({ roleId: post.roles[0].id });

    expect(res.status).toBe(403);
  });

  it("should return 422 if user has already sent a request", async () => {
    myStorage.items.set(user.apiKey, [{ id: liId, count: 100 }]);

    await request(app)
      .post(toUrl(post.id))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token)
      .send({ roleId: post.roles[0].id });
    const res = await request(app)
      .post(toUrl(post.id))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token)
      .send({ roleId: post.roles[0].id });

    expect(res.status).toBe(422);
  });

  it("should return 201 if valid data was passed", async () => {
    myStorage.items.set(user.apiKey, [{ id: liId, count: 100 }]);

    const res = await request(app)
      .post(toUrl(post.id))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token)
      .send({ roleId: post.roles[0].id });

    expect(res.status).toBe(201);
  });

  it("should save join request if valid data was passed", async () => {
    myStorage.items.set(user.apiKey, [{ id: liId, count: 100 }]);

    await request(app)
      .post(toUrl(post.id))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token)
      .send({ roleId: post.roles[0].id });

    expect(joinRequestRepo.entities.length).toBe(1);
  });

  const toUrl = (id: number) => {
    return `/raid-posts/${id}/join-request`;
  };
});
