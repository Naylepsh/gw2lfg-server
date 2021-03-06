import "reflect-metadata";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import request from "supertest";
import Container from "typedi";
import { DeleteRaidPostController } from "@root/api/controllers/raid-posts/delete-raid-post.controller";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { createToken } from "@root/api/utils/token/jwt";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { User } from "@root/data/entities/user/user.entity";
import { CheckPostAuthorshipService } from "@root/services/raid-post/check-post-authorship.service";
import { DeleteRaidPostService } from "@root/services/raid-post/delete-raid-post.service";
import { RegisterService } from "@root/services/user/register.service";
import { RaidPostMemoryUnitOfWork } from "../../../../common/uows/raid-post.memory-unit-of-work";
import { seedDbWithOnePost } from "./seed-db";
import { AUTH_HEADER, toBearerToken } from "../../../../common/to-bearer-token";

describe("DeleteRaidPostController integration tests", () => {
  let url = "/raid-posts";
  let post: RaidPost;
  let uow: RaidPostMemoryUnitOfWork;
  let registerService: RegisterService;
  let token: string;
  let app: any;

  beforeEach(async () => {
    uow = RaidPostMemoryUnitOfWork.create();

    ({ token, post } = await seedDbWithOnePost(uow));

    registerService = new RegisterService(uow.users);

    const unpublishService = new DeleteRaidPostService(uow);
    const authorshipService = new CheckPostAuthorshipService(uow.raidPosts);
    const controller = new DeleteRaidPostController(
      unpublishService,
      authorshipService
    );

    Container.set(DeleteRaidPostController, controller);
    useContainer(Container);

    const currentUserMiddleware = new CurrentUserJWTMiddleware(uow.users);

    app = createExpressServer({
      controllers: [DeleteRaidPostController],
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
    const otherUserToken = createToken(otherUserId);

    const res = await request(app)
      .delete(toUrl(post.id))
      .set(AUTH_HEADER, toBearerToken(otherUserToken));

    expect(res.status).toBe(403);
  });

  it("should return 204 if valid data was passed", async () => {
    const res = await request(app)
      .delete(toUrl(post.id))
      .set(AUTH_HEADER, toBearerToken(token));
    expect(res.status).toBe(204);
  });

  it("should return 204 if post does not exists", async () => {
    await request(app)
      .delete(toUrl(post.id))
      .set(AUTH_HEADER, toBearerToken(token));
    const res = await request(app)
      .delete(toUrl(post.id))
      .set(AUTH_HEADER, toBearerToken(token));

    expect(res.status).toBe(204);
  });

  it("should remove a post if it existed", async () => {
    await request(app)
      .delete(toUrl(post.id))
      .set(AUTH_HEADER, toBearerToken(token));

    expect(uow.committed).toBeTruthy();
  });

  const toUrl = (id: number) => `${url}/${id}`;
});
