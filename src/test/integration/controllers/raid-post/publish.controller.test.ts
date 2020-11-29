import "reflect-metadata";
import request from "supertest";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import Container from "typedi";
import { CurrentUserMiddleware } from "../../../../api/middleware/current-user.middleware";
import { PublishRaidPostController } from "../../../../api/controllers/raid-post/publish.controller";
import { PublishRaidPostService } from "../../../../services/raid-post/publish.service";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { addHours } from "../../../unit/services/raid-post/hours.util";
import { seedDbWithOnePost } from "./seed-db";

describe("PublishRaidPostController integration tests", () => {
  const url = "/raid-posts";
  let uow: RaidPostMemoryUnitOfWork;
  let app: any;
  let token: string;
  let bossesIds: number[];

  beforeEach(async () => {
    uow = RaidPostMemoryUnitOfWork.create();

    ({ token, bossesIds } = await seedDbWithOnePost(uow));

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
