import "reflect-metadata";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import request from "supertest";
import Container from "typedi";
import items from "@root/services/gw2-items/items.json";
import { FindRaidPostsController } from "@root/api/controllers/raid-posts/find-raid-posts.controller";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { GetItems } from "@root/services/gw2-api/items/get-items.gw2-api.service";
import { Item } from "@services/gw2-items/item.interface";
import { FindRaidPostsService } from "@root/services/raid-post/find-raid-posts.service";
import { CheckItemRequirementsService } from "@services/requirement/check-item-requirements.service";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { MyStorage } from "../../../unit/services/item-storage";
import { seedDbWithOnePost } from "./seed-db";

describe("FindRaidPostsController integration tests", () => {
  const url = "/raid-posts";
  let app: any;
  let token: string;

  beforeEach(async () => {
    const uow = RaidPostMemoryUnitOfWork.create();

    const { user, token: jwt } = await seedDbWithOnePost(uow);
    token = jwt;

    const findRaidPostsService = new FindRaidPostsService(uow.raidPosts);
    const myStorage = new MyStorage(
      new Map<string, Item[]>([
        [user.apiKey, [{ id: items["Legendary Insight"], count: 100 }]],
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
    const { status } = await request(app).get(url);

    expect(status).toBe(200);
  });

  it("should return 200 if some query params were passed", async () => {
    const { status } = await request(app).get(`${url}?take=10&skip=5`);

    expect(status).toBe(200);
  });

  /*
  This won't work. Controller uses special TypeORM function for handling dates.
  My in-memory repository has no way to deal with that. It works perfectly without that date condition tho. 
  */
  // it("should return a list of posts with unsatisfied requirements each if user was not logged in", async () => {
  //   const queryParams = { take: 10, skip: 0 };
  //   const { body } = await request(app).get(
  //     `${url}?take=${queryParams.take}&skip=${queryParams.skip}`
  //   );

  //   const posts = body.data;
  //   expect(posts.length).toBeGreaterThan(0);
  //   for (const post of posts as any[]) {
  //     expect(post).toHaveProperty("userMeetsRequirements", false);
  //   }
  // });

  /*
  This won't work. Controller uses special TypeORM function for handling dates.
  My in-memory repository has no way to deal with that. It works perfectly without that date condition tho. 
  */
  // it("should return a list of posts with userMeetsRequirements set to true on some of them if user meets their requirements", async () => {
  //   const queryParams = { take: 10, skip: 0 };
  //   const { body } = await request(app)
  //     .get(`${url}?take=${queryParams.take}&skip=${queryParams.skip}`)
  //     .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

  //   const posts = body.data;
  //   expect((posts as any[]).some((post) => post.userMeetsRequirements)).toBe(
  //     true
  //   );
  // });
});
