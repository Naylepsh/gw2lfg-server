import "reflect-metadata";
import request from "supertest";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import Container from "typedi";
import { CurrentUserMiddleware } from "../../../../api/middleware/current-user.middleware";
import { PublishRaidPostController } from "../../../../api/controllers/raid-post/publish.controller";
import { User } from "../../../../data/entities/user.entity";
import { PublishRaidPostService } from "../../../../services/raid-post/publish.service";
import { RegisterService } from "../../../../services/user/register";
import { RaidBossMemoryRepository } from "../../../helpers/repositories/raid-boss.memory-repository";
import { RaidPostMemoryRepository } from "../../../helpers/repositories/raid-post.memory-repository";
import { RequirementMemoryRepository } from "../../../helpers/repositories/requirement.memory-repository";
import { RoleMemoryRepository } from "../../../helpers/repositories/role.memory-repository";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { RaidBoss } from "../../../../data/entities/raid-boss.entity";
import { addHours } from "../../../unit/services/raid-post/hours.util";

describe("PublishRaidPostController integration tests", () => {
  const url = "/raid-post";
  let uow: RaidPostMemoryUnitOfWork;
  let app: any;
  let token: string;
  let bossesIds: number[];

  beforeEach(async () => {
    uow = new RaidPostMemoryUnitOfWork(
      new UserMemoryRepository(),
      new RaidBossMemoryRepository(),
      new RoleMemoryRepository(),
      new RequirementMemoryRepository(),
      new RaidPostMemoryRepository()
    );
    const registerService = new RegisterService(uow.users);

    const user = new User({
      username: "existingUser",
      password: "password",
      apiKey: "api-key",
    });
    await registerService.register(user);
    token = "0";

    const boss = new RaidBoss({ name: "boss", isCm: false });
    const savedBoss = await uow.raidBosses.save(boss);
    bossesIds = [savedBoss.id];

    const publishService = new PublishRaidPostService(uow);
    const controller = new PublishRaidPostController(publishService);

    Container.set(PublishRaidPostController, controller);
    useContainer(Container);

    const currentUserMiddleware = new CurrentUserMiddleware(uow.users);

    app = createExpressServer({
      controllers: [PublishRaidPostController],
      currentUserChecker: async (action: Action) =>
        await currentUserMiddleware.getCurrentUser(action),
    });
  });

  it("should return 401 if user was not logged in", async () => {
    const res = await request(app).post(url).send({});

    expect(res.status).toBe(401);
  });

  it("should return 400 if some properties were missing", async () => {
    const res = await request(app)
      .post(url)
      .send({})
      .set(CurrentUserMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(400);
  });

  it("should return 201 if valid data was passed", async () => {
    const dto = {
      server: "EU",
      date: addHours(new Date(), 12),
      bossesIds,
    };

    const res = await request(app)
      .post(url)
      .send(dto)
      .set(CurrentUserMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(201);
  });

  it("should create a raid post if valid data was passed", async () => {
    const dto = {
      server: "EU",
      date: addHours(new Date(), 12),
      bossesIds,
    };

    await request(app)
      .post(url)
      .send(dto)
      .set(CurrentUserMiddleware.AUTH_HEADER, token);

    expect(uow.committed).toBeTruthy();
  });
});
