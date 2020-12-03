import "reflect-metadata";
// import * as jwt from "jsonwebtoken";
import request from "supertest";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import Container from "typedi";
import { FindRaidPostsController } from "../../../../api/controllers/raid-post/find.controller";
import { CurrentUserJWTMiddleware } from "../../../../api/middleware/current-user.middleware";
import { FindRaidPostService } from "../../../../services/raid-post/find.service";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { seedDbWithOnePost } from "./seed-db";

describe("FindRaidPostsController integration tests", () => {
  const url = "/raid-posts";
  let app: any;
  let findPosts: any;

  beforeEach(async () => {
    const uow = RaidPostMemoryUnitOfWork.create();

    await seedDbWithOnePost(uow);

    const findRaidPostsService = new FindRaidPostService(uow.raidPosts);
    findPosts = jest.spyOn(findRaidPostsService, "find");
    const controller = new FindRaidPostsController(findRaidPostsService);

    Container.set(FindRaidPostsController, controller);
    useContainer(Container);

    const currentUserMiddleware = new CurrentUserJWTMiddleware(uow.users);

    app = createExpressServer({
      controllers: [FindRaidPostsController],
      currentUserChecker: async (action: Action) =>
        await currentUserMiddleware.getCurrentUser(action),
    });
  });

  it("should return 200 if no query params were passed", async () => {
    const res = await request(app).get(url);

    expect(res.status).toBe(200);
  });

  it("should return 200 if some query params were passed", async () => {
    const res = await request(app).get(`${url}?take=10&skip=5`);

    expect(res.status).toBe(200);
  });

  it("should pass pagination arguments to service", async () => {
    const queryParams = { take: 10, skip: 5 };
    await request(app).get(
      `${url}?take=${queryParams.take}&skip=${queryParams.skip}`
    );

    expect(findPosts).toHaveBeenCalledWith(queryParams);
  });
});
