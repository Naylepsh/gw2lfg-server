import "reflect-metadata";
import request from "supertest";
import { createExpressServer, Action, useContainer } from "routing-controllers";
import Container from "typedi";
import { UnpublishRaidPostController } from "../../../../api/controllers/raid-post/unpublish.controller";
import { CurrentUserMiddleware } from "../../../../api/middleware/current-user.middleware";
import { User } from "../../../../data/entities/user.entity";
import { PostAuthorshipService } from "../../../../services/raid-post/authorship.service";
import { UnpublishRaidPostService } from "../../../../services/raid-post/unpublish.service";
import { RegisterService } from "../../../../services/user/register";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { seedDbWithOnePost } from "./seed-db";
import { RaidPost } from "../../../../data/entities/raid-post.entitity";

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

    registerService = new RegisterService(uow.users);

    const unpublishService = new UnpublishRaidPostService(uow);
    const authorshipService = new PostAuthorshipService(uow.raidPosts);
    const controller = new UnpublishRaidPostController(
      unpublishService,
      authorshipService
    );

    Container.set(UnpublishRaidPostController, controller);
    useContainer(Container);

    const currentUserMiddleware = new CurrentUserMiddleware(uow.users);

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
    const otherUserToken = otherUserId.toString();

    const res = await request(app)
      .delete(toUrl(post.id))
      .set(CurrentUserMiddleware.AUTH_HEADER, otherUserToken);

    expect(res.status).toBe(403);
  });

  it("should return 204 if valid data was passed", async () => {
    const res = await request(app)
      .delete(toUrl(post.id))
      .set(CurrentUserMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(204);
  });

  it("should return 204 if post does not exists", async () => {
    await request(app)
      .delete(toUrl(post.id))
      .set(CurrentUserMiddleware.AUTH_HEADER, token);
    const res = await request(app)
      .delete(toUrl(post.id))
      .set(CurrentUserMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(204);
  });

  it("should remove a post if it existed", async () => {
    await request(app)
      .delete(toUrl(post.id))
      .set(CurrentUserMiddleware.AUTH_HEADER, token);

    expect(uow.committed).toBeTruthy();
  });

  const toUrl = (id: number) => `${url}/${id}`;
});