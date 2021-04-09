import "reflect-metadata";
import { createExpressServer, useContainer } from "routing-controllers";
import request from "supertest";
import Container from "typedi";
import { FindRaidPostsController } from "@root/api/controllers/raid-posts/find-raid-posts.controller";
import { FindRaidPostsService } from "@root/services/raid-post/find-raid-posts.service";
import { RaidPostMemoryUnitOfWork } from "../../../../common/uows/raid-post.memory-unit-of-work";
import { seedDbWithOnePost } from "./seed-db";

describe("FindRaidPostsController integration tests", () => {
  const url = "/raid-posts";
  let app: any;
  let token: string;

  beforeEach(async () => {
    const uow = RaidPostMemoryUnitOfWork.create();

    const { token: jwt } = await seedDbWithOnePost(uow);
    token = jwt;

    const findRaidPostsService = new FindRaidPostsService(uow.raidPosts);
    const controller = new FindRaidPostsController(findRaidPostsService);

    Container.set(FindRaidPostsController, controller);
    useContainer(Container);

    app = createExpressServer({
      controllers: [FindRaidPostsController],
    });
  });

  it("should return 200 if no query params were passed", async () => {
    const { status } = await request(app).get(url);

    expect(status).toBe(200);
  });

  it("should return 200 if some query params were passed", async () => {
    const { status } = await request(app).get(`${url}?take=10&skip=5`);

    expect(status).toBe(200);
  });
});
