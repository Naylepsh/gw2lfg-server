import "reflect-metadata";
import request from "supertest";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import Container from "typedi";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { CreateRaidPostController } from "@root/api/controllers/raid-posts/create-raid-post.controller";
import { CreateRaidPostService } from "@root/services/raid-post/create-raid-post.service";
import { RaidPostMemoryUnitOfWork } from "../../../../common/uows/raid-post.memory-unit-of-work";
import { addHours } from "../../../../common/hours.util";
import { seedDbWithOnePost } from "./seed-db";
import { AUTH_HEADER, toBearerToken } from "../../../../common/to-bearer-token";

describe("CreateRaidPostController integration tests", () => {
  const url = "/raid-posts";
  let uow: RaidPostMemoryUnitOfWork;
  let app: any;
  let token: string;
  let bossesIds: number[];

  beforeEach(async () => {
    uow = RaidPostMemoryUnitOfWork.create();

    ({ token, bossesIds } = await seedDbWithOnePost(uow));

    const publishService = new CreateRaidPostService(uow);
    const controller = new CreateRaidPostController(publishService);

    Container.set(CreateRaidPostController, controller);
    useContainer(Container);

    const currentUserMiddleware = new CurrentUserJWTMiddleware(uow.users);

    app = createExpressServer({
      controllers: [CreateRaidPostController],
      currentUserChecker: async (action: Action) =>
        await currentUserMiddleware.getCurrentUser(action),
    });
  });

  it("should return 401 if user was not logged in", async () => {
    const res = await request(app).post(url).send({});

    expect(res.status).toBe(401);
  });

  it("should return 400 if some properties were missing", async () => {
    const emptyPayload = {};

    const res = await request(app)
      .post(url)
      .send(emptyPayload)
      .set(AUTH_HEADER, toBearerToken(token));

    expect(res.status).toBe(400);
  });

  it("should return 201 if valid data was passed", async () => {
    const dto = {
      server: "EU",
      date: addHours(new Date(), 12).toISOString(),
      bossesIds,
      rolesProps: [{ name: "dps", class: "warrior" }],
    };

    const res = await request(app)
      .post(url)
      .send(dto)
      .set(AUTH_HEADER, toBearerToken(token));

    expect(res.status).toBe(201);
  });

  it("should create a raid post if valid data was passed", async () => {
    const dto = {
      server: "EU",
      date: addHours(new Date(), 12).toISOString(),
      bossesIds,
    };

    await request(app)
      .post(url)
      .send(dto)
      .set(AUTH_HEADER, toBearerToken(token));

    expect(uow.committed).toBeTruthy();
  });
});
