import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import items from "@services/gw2-api/items/items.json";
import { CreateRaidJoinRequestController } from "@root/api/controllers/join-requests/send-join-request.controller";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { User } from "@root/data/entities/user/user.entity";
import { GetItems } from "@root/services/gw2-api/items/get-items.fetcher";
import { CreateJoinRequestService } from "@root/services/join-request/create-join-request.service";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import { JoinRequestMemoryRepository } from "../../../../common/repositories/join-request.memory-repository";
import { RaidPostMemoryUnitOfWork } from "../../../../common/uows/raid-post.memory-unit-of-work";
import { MyStorage } from "../../../../unit/services/item-storage";
import { seedDbWithOnePost } from "../raid-post/seed-db";
import { CheckItemRequirementsService } from "@root/services/requirement/check-item-requirements.service";
import { FindUserItemsService } from "@services/user/find-user-items.service";
import { AUTH_HEADER, toBearerToken } from "../../../../common/to-bearer-token";
import { GW2ApiItem } from "../../../../services/gw2-api/items/item.interface";
import { NotificationMemoryRepository } from "../../../../common/repositories/notification.memory-repository";
import { CreateNotificationService } from "@services/notification/create-notification.service";

describe("SendRaidJoinRequestController integration tests", () => {
  const liId = items["Legendary Insight"];
  const url = "/join-requests";
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
      new Map<string, GW2ApiItem[]>([[user.apiKey, [{ id: liId, count: 1 }]]])
    );
    const findUserItemsService = new FindUserItemsService(
      uow.users,
      new GetItems(myStorage.fetch.bind(myStorage))
    );
    const requirementChecker = new CheckItemRequirementsService(
      findUserItemsService
    );
    const notificationRepo = new NotificationMemoryRepository();
    const notificationService = new CreateNotificationService(notificationRepo);
    joinRequestRepo = new JoinRequestMemoryRepository();
    const sendJoinRequestService = new CreateJoinRequestService(
      uow.users,
      uow.raidPosts,
      joinRequestRepo,
      requirementChecker,
      notificationService
    );
    const controller = new CreateRaidJoinRequestController(
      sendJoinRequestService
    );

    Container.set(CreateRaidJoinRequestController, controller);
    useContainer(Container);

    const currentUserMiddleware = new CurrentUserJWTMiddleware(uow.users);

    app = createExpressServer({
      controllers: [CreateRaidJoinRequestController],
      currentUserChecker: async (action: Action) =>
        await currentUserMiddleware.getCurrentUser(action),
    });
  });

  it("should return 401 if user was not logged in", async () => {
    const res = await request(app)
      .post(url)
      .send({ roleId: post.roles[0].id, postId: post.id });

    expect(res.status).toBe(401);
  });

  it("should return 404 if post does not exists", async () => {
    const idOfNonExistingPost = 123;

    const res = await request(app)
      .post(url)
      .set(AUTH_HEADER, toBearerToken(token))
      .send({ roleId: post.roles[0].id, postId: idOfNonExistingPost });

    expect(res.status).toBe(404);
  });

  it("should return 404 if post does not contain the role", async () => {
    const idOfNonExistsingRole = 456;

    const res = await request(app)
      .post(url)
      .set(AUTH_HEADER, toBearerToken(token))
      .send({ roleId: idOfNonExistsingRole, postId: post.id });

    expect(res.status).toBe(404);
  });

  it("should return 403 if user did not meet post requirements", async () => {
    myStorage.items.set(user.apiKey, [{ id: liId, count: 0 }]);

    const res = await request(app)
      .post(url)
      .set(AUTH_HEADER, toBearerToken(token))
      .send({ roleId: post.roles[0].id, postId: post.id });

    expect(res.status).toBe(403);
  });

  it("should return 409 if user has already sent a request", async () => {
    myStorage.items.set(user.apiKey, [{ id: liId, count: 100 }]);

    await request(app)
      .post(url)
      .set(AUTH_HEADER, toBearerToken(token))
      .send({ roleId: post.roles[0].id, postId: post.id });
    const res = await request(app)
      .post(url)
      .set(AUTH_HEADER, toBearerToken(token))
      .send({ roleId: post.roles[0].id, postId: post.id });

    expect(res.status).toBe(409);
  });

  it("should return 201 if valid data was passed", async () => {
    myStorage.items.set(user.apiKey, [{ id: liId, count: 100 }]);

    const res = await request(app)
      .post(url)
      .set(AUTH_HEADER, toBearerToken(token))
      .send({ roleId: post.roles[0].id, postId: post.id });

    expect(res.status).toBe(201);
  });

  it("should save join request if valid data was passed", async () => {
    myStorage.items.set(user.apiKey, [{ id: liId, count: 100 }]);

    await request(app)
      .post(url)
      .set(AUTH_HEADER, toBearerToken(token))
      .send({ roleId: post.roles[0].id, postId: post.id });

    expect(joinRequestRepo.entities.length).toBe(1);
  });
});
