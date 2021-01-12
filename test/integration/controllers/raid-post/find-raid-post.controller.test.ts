import "reflect-metadata";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import request from "supertest";
import Container from "typedi";
import items from "@root/services/gw2-items/items.json";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { GetItems } from "@root/services/gw2-api/items/get-items.gw2-api.service";
import { GW2ApiItem } from "@services/gw2-items/item.interface";
import { CheckItemRequirementsService } from "@services/requirement/check-item-requirements.service";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { MyStorage } from "../../../unit/services/item-storage";
import { seedDbWithOnePost } from "./seed-db";
import { FindRaidPostService } from "@services/raid-post/find-raid-post.service";
import { FindRaidPostController } from "@api/controllers/raid-posts/find-raid-post.controller";
import { CheckRequirementsService } from "@services/requirement/check-requirements.service";
import { FindUserItemsService } from "@services/user/find-user-items.service";

describe("FindRaidPostController integration tests", () => {
  let app: any;
  let postId: number;
  let token: string;

  beforeEach(async () => {
    const uow = RaidPostMemoryUnitOfWork.create();

    const { user, post, token: jwt } = await seedDbWithOnePost(uow);
    postId = post.id;
    token = jwt;

    const findRaidPostsService = new FindRaidPostService(uow.raidPosts);
    const myStorage = new MyStorage(
      new Map<string, GW2ApiItem[]>([
        [user.apiKey, [{ id: items["Legendary Insight"], count: 100 }]],
      ])
    );
    const itemRequirementChecker = new CheckItemRequirementsService();
    const findUserItemsService = new FindUserItemsService(
      uow.users,
      new GetItems(myStorage.fetch.bind(myStorage))
    );
    const requirementChecker = new CheckRequirementsService(
      itemRequirementChecker,
      findUserItemsService
    );
    const controller = new FindRaidPostController(findRaidPostsService, requirementChecker);

    Container.set(FindRaidPostController, controller);
    useContainer(Container);

    const currentUserMiddleware = new CurrentUserJWTMiddleware(uow.users);

    app = createExpressServer({
      controllers: [FindRaidPostController],
      currentUserChecker: async (action: Action) =>
        await currentUserMiddleware.getCurrentUser(action),
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

  it("should return a post with unsatisfied requirements if user was not logged in", async () => {
    const { body } = await request(app).get(toUrl(postId));

    const post = body.data;
    expect(post).toHaveProperty("userMeetsRequirements", false);
  });

  it("should return a post with satisfied requirements if user meets all of them", async () => {
    const { body } = await request(app)
      .get(toUrl(postId))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    const post = body.data;
    expect(post).toHaveProperty("userMeetsRequirements", true);
  });

  function toUrl(id: number) {
    return `/raid-posts/${id}`;
  }
});
