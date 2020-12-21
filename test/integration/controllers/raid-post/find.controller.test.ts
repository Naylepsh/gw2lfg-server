import "reflect-metadata";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import request from "supertest";
import Container from "typedi";
import { FindRaidPostsController } from "@api/controllers/raid-post/find.controller";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { LIRequirement } from "@data/entities/requirement.entity";
import { GetItems } from "@services/gw2-api/gw2-api.service";
import { nameToId } from "@services/gw2-items/gw2-items.service";
import { Item } from "@services/gw2-items/item.interface";
import { FindRaidPostService } from "@services/raid-post/find.service";
import { CheckItemRequirementsService } from "@services/requirement/check-item-requirements.service";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { MyStorage } from "../../../unit/services/item-storage";
import { seedDbWithOnePost } from "./seed-db";

describe("FindRaidPostsController integration tests", () => {
  const url = "/raid-posts";
  let app: any;
  let findPosts: any;

  beforeEach(async () => {
    const uow = RaidPostMemoryUnitOfWork.create();

    const { user } = await seedDbWithOnePost(uow);

    const findRaidPostsService = new FindRaidPostService(uow.raidPosts);
    findPosts = jest.spyOn(findRaidPostsService, "find");
    const myStorage = new MyStorage(
      new Map<string, Item[]>([
        [user.apiKey, [{ id: nameToId(LIRequirement.itemName), count: 100 }]],
      ])
    );
    const requirementChecker = new CheckItemRequirementsService(
      new GetItems(myStorage.fetch.bind(myStorage))
    );
    const controller = new FindRaidPostsController(
      findRaidPostsService,
      requirementChecker
    );

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

  it("should return a list of posts with unsatisfied requirements each if user was not logged in", async () => {
    const queryParams = { take: 10, skip: 0 };
    const res = await request(app).get(
      `${url}?take=${queryParams.take}&skip=${queryParams.skip}`
    );

    const posts = res.body.data;
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts as any[]) {
      expect(post).toHaveProperty("userMeetsRequirements", false);
    }
  });

  it("should return a list of posts with userMeetsRequirements set to true on some of them if user meets their requirements", async () => {
    const queryParams = { take: 10, skip: 0 };
    const res = await request(app).get(
      `${url}?take=${queryParams.take}&skip=${queryParams.skip}`
    );

    const requirementChecks = res.body.data.map(
      (post: { userMeetsRequirements: boolean }) => post.userMeetsRequirements
    );
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(requirementChecks.some((check: boolean) => check));
  });
});
