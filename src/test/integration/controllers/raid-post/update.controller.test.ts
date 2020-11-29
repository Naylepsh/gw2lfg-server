import "reflect-metadata";
import request from "supertest";
import { createExpressServer, Action, useContainer } from "routing-controllers";
import Container from "typedi";
import { UpdateRaidPostController } from "../../../../api/controllers/raid-post/update.controller";
import { CurrentUserMiddleware } from "../../../../api/middleware/current-user.middleware";
import { RaidBoss } from "../../../../data/entities/raid-boss.entity";
import { User } from "../../../../data/entities/user.entity";
import { PostAuthorshipService } from "../../../../services/raid-post/authorship.service";
import { UpdateRaidPostService } from "../../../../services/raid-post/update.service";
import { RegisterService } from "../../../../services/user/register";
import { RaidBossMemoryRepository } from "../../../helpers/repositories/raid-boss.memory-repository";
import { RaidPostMemoryRepository } from "../../../helpers/repositories/raid-post.memory-repository";
import { RequirementMemoryRepository } from "../../../helpers/repositories/requirement.memory-repository";
import { RoleMemoryRepository } from "../../../helpers/repositories/role.memory-repository";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { PublishRaidPostService } from "../../../../services/raid-post/publish.service";
import { addHours } from "../../../unit/services/raid-post/hours.util";

describe("UpdateRaidPostController integration tests", () => {
  let url = "/raid-posts";
  let postId: number;
  let uow: RaidPostMemoryUnitOfWork;
  let registerService: RegisterService;
  let token: string;
  let app: any;
  let bossesIds: number[];

  beforeEach(async () => {
    uow = new RaidPostMemoryUnitOfWork(
      new UserMemoryRepository(),
      new RaidBossMemoryRepository(),
      new RoleMemoryRepository(),
      new RequirementMemoryRepository(),
      new RaidPostMemoryRepository()
    );

    registerService = new RegisterService(uow.users);
    const author = new User({
      username: "existingUser",
      password: "password",
      apiKey: "api-key",
    });
    const { id: userid } = await registerService.register(author);
    token = userid.toString();

    const boss = new RaidBoss({ name: "boss", isCm: false });
    const savedBoss = await uow.raidBosses.save(boss);
    bossesIds = [savedBoss.id];

    const publishService = new PublishRaidPostService(uow);
    const dto = {
      server: "EU",
      date: addHours(new Date(), 12),
      bossesIds,
      rolesProps: [],
      requirementsProps: [],
      authorId: userid,
    };
    const post = await publishService.publish(dto);
    postId = post.id;

    const updateService = new UpdateRaidPostService(uow);
    const authorshipService = new PostAuthorshipService(uow.raidPosts);
    const controller = new UpdateRaidPostController(
      updateService,
      authorshipService
    );

    Container.set(UpdateRaidPostController, controller);
    useContainer(Container);

    const currentUserMiddleware = new CurrentUserMiddleware(uow.users);

    app = createExpressServer({
      controllers: [UpdateRaidPostController],
      currentUserChecker: async (action: Action) =>
        await currentUserMiddleware.getCurrentUser(action),
    });
  });

  it("should return 401 if user was not logged in", async () => {
    const res = await request(app).put(toUrl(postId)).send({});

    expect(res.status).toBe(401);
  });

  it("should return 404 if post does not exist", async () => {
    const idOfNonExistingPost = 123;
    const dto = {
      server: "EU",
      date: addHours(new Date(), 13),
      bossesIds,
      rolesProps: [],
      requirementsProps: [],
    };
    const res = await request(app)
      .put(toUrl(idOfNonExistingPost))
      .send(dto)
      .set(CurrentUserMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(404);
  });

  it("should return 403 if user is not the author", async () => {
    const otherUser = new User({
      username: "otherUser",
      password: "password",
      apiKey: "api-key",
    });
    const { id: otherUserId } = await registerService.register(otherUser);
    const otherUserToken = otherUserId.toString();
    const dto = {
      server: "EU",
      date: addHours(new Date(), 13),
      bossesIds,
      rolesProps: [],
      requirementsProps: [],
    };

    const res = await request(app)
      .put(toUrl(postId))
      .send(dto)
      .set(CurrentUserMiddleware.AUTH_HEADER, otherUserToken);

    expect(res.status).toBe(403);
  });

  it("should return 200 if valid data was passed", async () => {
    const dto = {
      server: "EU",
      date: addHours(new Date(), 13),
      bossesIds,
      rolesProps: [],
      requirementsProps: [],
    };

    const res = await request(app)
      .put(toUrl(postId))
      .send(dto)
      .set(CurrentUserMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(200);
  });

  it("should save a post if valid data was passed", async () => {
    const dto = {
      server: "EU",
      date: addHours(new Date(), 13),
      bossesIds,
      rolesProps: [],
      requirementsProps: [],
    };

    await request(app)
      .put(toUrl(postId))
      .send(dto)
      .set(CurrentUserMiddleware.AUTH_HEADER, token);

    expect(uow.committed).toBeTruthy();
  });

  const toUrl = (id: number) => `${url}/${id}`;
});
