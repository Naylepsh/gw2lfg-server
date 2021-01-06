import "reflect-metadata";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import request from "supertest";
import Container from "typedi";
import { UnpublishRaidPostController } from "@root/api/controllers/raid-posts/unpublish.controller";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { CreateJwtService } from "@api/services/token/create";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { User } from "@root/data/entities/user/user.entity";
import { CheckPostAuthorshipService } from "@root/services/raid-post/check-post-authorship.service";
import { UnpublishRaidPostService } from "@root/services/raid-post/unpublish-raid-post.service";
import { RegisterService } from "@root/services/user/register.service";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { seedDbWithOnePost } from "./seed-db";
import { FakeApiKeyChecker } from "../../../unit/services/fake-api-key-checker";

describe("UnpublishRaidPostController integration tests", () => {
  let url = "/raid-posts";
  let post: RaidPost;
  let uow: RaidPostMemoryUnitOfWork;
  let registerService: RegisterService;
  let token: string;
  let app: any;

  beforeEach(async () => {
    uow = RaidPostMemoryUnitOfWork.create();

    ({ token, post } = await seedDbWithOnePost(uow));

    const apiKeyChecker = new FakeApiKeyChecker(true);
    registerService = new RegisterService(uow.users, apiKeyChecker);

    const unpublishService = new UnpublishRaidPostService(uow);
    const authorshipService = new CheckPostAuthorshipService(uow.raidPosts);
    const controller = new UnpublishRaidPostController(
      unpublishService,
      authorshipService
    );

    Container.set(UnpublishRaidPostController, controller);
    useContainer(Container);

    const currentUserMiddleware = new CurrentUserJWTMiddleware(uow.users);

    app = createExpressServer({
      controllers: [UnpublishRaidPostController],
      currentUserChecker: async (action: Action) =>
        await currentUserMiddleware.getCurrentUser(action),
    });
  });

  it("should return 401 if user was not logged in", async () => {
    const res = await request(app).delete(toUrl(post.id));

    expect(res.status).toBe(401);
  });

  it("should return 403 if user is not the author", async () => {
    const otherUser = new User({
      username: "otherUser",
      password: "password",
      apiKey: "api-key",
    });
    const { id: otherUserId } = await registerService.register(otherUser);
    const otherUserToken = new CreateJwtService().createToken(otherUserId);

    const res = await request(app)
      .delete(toUrl(post.id))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, otherUserToken);

    expect(res.status).toBe(403);
  });

  it("should return 204 if valid data was passed", async () => {
    const res = await request(app)
      .delete(toUrl(post.id))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(204);
  });

  it("should return 204 if post does not exists", async () => {
    await request(app)
      .delete(toUrl(post.id))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);
    const res = await request(app)
      .delete(toUrl(post.id))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(204);
  });

  it("should remove a post if it existed", async () => {
    await request(app)
      .delete(toUrl(post.id))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    expect(uow.committed).toBeTruthy();
  });

  const toUrl = (id: number) => `${url}/${id}`;
});
