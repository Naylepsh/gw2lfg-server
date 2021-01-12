import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import items from "@root/services/gw2-items/items.json";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { User } from "@root/data/entities/user/user.entity";
import { SendJoinRequestService } from "@services/join-request/send-join-request.service";
import { GetItems } from "@root/services/gw2-api/items/get-items.gw2-api.service";
import { GW2ApiItem } from "@services/gw2-items/item.interface";
import { CheckItemRequirementsService } from "@services/requirement/check-item-requirements.service";
import { FindJoinRequestsService } from "@services/join-request/find-join-requests.service";
import { FindJoinRequestsController } from "@api/controllers/join-requests/find-join-requests.controller";
import { createExpressServer, useContainer } from "routing-controllers";
import { JoinRequestMemoryRepository } from "../../../helpers/repositories/join-request.memory-repository";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { MyStorage } from "../../../unit/services/item-storage";
import { seedDbWithOnePost } from "../raid-post/seed-db";
import { CheckRequirementsService } from "@services/requirement/check-requirements.service";
import { FindUserItemsService } from "@services/user/find-user-items.service";

describe("FindJoinRequestsController: integration tests", () => {
  const liId = items["Legendary Insight"];
  let joinRequestRepo: JoinRequestMemoryRepository;
  let app: any;
  let post: RaidPost;
  let user: User;

  beforeEach(async () => {
    const uow = RaidPostMemoryUnitOfWork.create();

    ({ post, user } = await seedDbWithOnePost(uow));

    joinRequestRepo = new JoinRequestMemoryRepository();
    await seedDbWithOneJoinRequest(user, uow, joinRequestRepo, post);

    const findJoinRequestsService = new FindJoinRequestsService(
      joinRequestRepo
    );

    const controller = new FindJoinRequestsController(findJoinRequestsService);

    Container.set(FindJoinRequestsController, controller);
    useContainer(Container);

    app = createExpressServer({
      controllers: [FindJoinRequestsController],
    });
  });

  const seedDbWithOneJoinRequest = async (
    user: User,
    uow: RaidPostMemoryUnitOfWork,
    joinRequestRepo: JoinRequestMemoryRepository,
    post: RaidPost
  ) => {
    const myStorage = new MyStorage(
      new Map<string, GW2ApiItem[]>([[user.apiKey, [{ id: liId, count: 100 }]]])
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
    const sendJoinRequestService = new SendJoinRequestService(
      uow.users,
      uow.raidPosts,
      joinRequestRepo,
      requirementChecker
    );
    await sendJoinRequestService.sendJoinRequest({
      userId: user.id,
      postId: post.id,
      roleId: post.roles[0].id,
    });
  };

  it("should return all join requests with given query params", async () => {
    const userId = user.id;

    const { body } = await request(app).get(toUrl({ userId }));

    expect(body.data?.length).toBeGreaterThan(0);
  });

  const toUrl = (queryParams: {
    userId?: number;
    postId?: number;
    roleId?: number;
  }) => {
    const { userId, postId, roleId } = queryParams;
    const userQuery = userId ? `userId=${userId}` : undefined;
    const postQuery = postId ? `postId=${postId}` : undefined;
    const roleQuery = roleId ? `roleId=${roleId}` : undefined;
    const params = [userQuery, postQuery, roleQuery].filter((query) => !!query);
    const queryString = params.join("&");
    return `/join-requests?${queryString}`;
  };
});
