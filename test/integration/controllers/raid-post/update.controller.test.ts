import "reflect-metadata";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import request from "supertest";
import Container from "typedi";
import { UpdateRaidPostController } from "@root/api/controllers/raid-posts/update.controller";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { CreateJwtService } from "@api/services/token/create";
import { RaidPost } from "@data/entities/raid-post.entitity";
import { User } from "@data/entities/user.entity";
import { CheckPostAuthorshipService } from "@root/services/raid-post/check-post-authorship.service";
import { UpdateRaidPostService } from "@root/services/raid-post/update-raid-post.service";
import { RegisterService } from "@services/user/register";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { addHours } from "../../../unit/services/raid-post/hours.util";
import { seedDbWithOnePost } from "./seed-db";

describe("UpdateRaidPostController integration tests", () => {
  let url = "/raid-posts";
  let post: RaidPost;
  let uow: RaidPostMemoryUnitOfWork;
  let registerService: RegisterService;
  let token: string;
  let app: any;
  let bossesIds: number[];

  beforeEach(async () => {
    uow = RaidPostMemoryUnitOfWork.create();

    ({ token, bossesIds, post } = await seedDbWithOnePost(uow));

    registerService = new RegisterService(uow.users);

    const updateService = new UpdateRaidPostService(uow);
    const authorshipService = new CheckPostAuthorshipService(uow.raidPosts);
    const controller = new UpdateRaidPostController(
      updateService,
      authorshipService
    );

    Container.set(UpdateRaidPostController, controller);
    useContainer(Container);

    const currentUserMiddleware = new CurrentUserJWTMiddleware(uow.users);

    app = createExpressServer({
      controllers: [UpdateRaidPostController],
      currentUserChecker: async (action: Action) =>
        await currentUserMiddleware.getCurrentUser(action),
    });
  });

  it("should return 401 if user was not logged in", async () => {
    const res = await request(app).put(toUrl(post.id)).send({});

    expect(res.status).toBe(401);
  });

  it("should return 404 if post does not exist", async () => {
    const idOfNonExistingPost = 123;
    const dto = {
      server: "EU",
      date: addHours(new Date(), 13),
      bossesIds,
    };
    const res = await request(app)
      .put(toUrl(idOfNonExistingPost))
      .send(dto)
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(404);
  });

  it("should return 403 if user is not the author", async () => {
    const otherUser = new User({
      username: "otherUser",
      password: "password",
      apiKey: "api-key",
    });
    const { id: otherUserId } = await registerService.register(otherUser);
    const otherUserToken = new CreateJwtService().createToken(otherUserId);
    const dto = {
      server: "EU",
      date: addHours(new Date(), 13),
      bossesIds,
    };

    const res = await request(app)
      .put(toUrl(post.id))
      .send(dto)
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, otherUserToken);

    expect(res.status).toBe(403);
  });

  it("should return 200 if valid data was passed", async () => {
    const dto = {
      server: "EU",
      date: addHours(new Date(), 13),
      bossesIds,
    };

    const res = await request(app)
      .put(toUrl(post.id))
      .send(dto)
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(200);
  });

  it("should save a post if valid data was passed", async () => {
    const dto = {
      server: "EU",
      date: addHours(new Date(), 13),
      bossesIds,
    };

    await request(app)
      .put(toUrl(post.id))
      .send(dto)
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    expect(uow.committed).toBeTruthy();
  });

  const toUrl = (id: number) => `${url}/${id}`;
});
