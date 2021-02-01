import "reflect-metadata";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import request from "supertest";
import Container from "typedi";
import { RaidPostMemoryUnitOfWork } from "../../../common/uows/raid-post.memory-unit-of-work";
import { seedDbWithOnePost } from "./seed-db";
import { FindRaidPostService } from "@services/raid-post/find-raid-post.service";
import { FindRaidPostController } from "@api/controllers/raid-posts/find-raid-post.controller";

describe("FindRaidPostController integration tests", () => {
  let app: any;
  let postId: number;
  let token: string;

  beforeEach(async () => {
    const uow = RaidPostMemoryUnitOfWork.create();

    const { post, token: jwt } = await seedDbWithOnePost(uow);
    postId = post.id;
    token = jwt;

    const findRaidPostsService = new FindRaidPostService(uow.raidPosts);
    const controller = new FindRaidPostController(findRaidPostsService);

    Container.set(FindRaidPostController, controller);
    useContainer(Container);

    app = createExpressServer({
      controllers: [FindRaidPostController],
    });
  });

  it("should return 404 if a post was not found", async () => {
    const idOfNonExistantPost = -1;

    const { status } = await request(app).get(toUrl(idOfNonExistantPost));

    expect(status).toBe(404);
  });

  it("should return 200 if post was found", async () => {
    const { status } = await request(app).get(toUrl(postId));

    expect(status).toBe(200);
  });

  function toUrl(id: number) {
    return `/raid-posts/${id}`;
  }
});
