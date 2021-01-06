import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import items from "@root/services/gw2-items/items.json";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { User } from "@root/data/entities/user/user.entity";
import { SendJoinRequestService } from "@services/join-request/send-join-request.service";
import { GetItems } from "@root/services/gw2-api/items/get-items.gw2-api.service";
import { Item } from "@services/gw2-items/item.interface";
import { CheckItemRequirementsService } from "@services/requirement/check-item-requirements.service";
import { FindJoinRequestsService } from "@services/join-request/find-join-requests.service";
import { FindJoinRequestsController } from "@api/controllers/join-requests/find-join-requests.controller";
import { createExpressServer, useContainer } from "routing-controllers";
import { JoinRequestMemoryRepository } from "../../../helpers/repositories/join-request.memory-repository";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { MyStorage } from "../../../unit/services/item-storage";
import { seedDbWithOnePost } from "../raid-post/seed-db";

describe("FindJoinRequestsController: integration tests", () => {
  const liId = items["Legendary Insight"];
  let joinRequestRepo: JoinRequestMemoryRepository;
  let app: any;
  let post: RaidPost;
  let user: User;
  let sendJoinRequestService: SendJoinRequestService;

  beforeEach(async () => {
    const uow = RaidPostMemoryUnitOfWork.create();

    ({ post, user } = await seedDbWithOnePost(uow));

    joinRequestRepo = new JoinRequestMemoryRepository();
    sendJoinRequestService = seedDbWithOneJoinRequest(
      user,
      uow,
      joinRequestRepo,
      post
    );

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

  const seedDbWithOneJoinRequest = (
    user: User,
    uow: RaidPostMemoryUnitOfWork,
    joinRequestRepo: JoinRequestMemoryRepository,
    post: RaidPost
  ) => {
    const myStorage = new MyStorage(
      new Map<string, Item[]>([[user.apiKey, [{ id: liId, count: 100 }]]])
    );
    const requirementChecker = new CheckItemRequirementsService(
      new GetItems(myStorage.fetch.bind(myStorage))
    );
    const sendJoinRequestService = new SendJoinRequestService(
      uow.users,
      uow.raidPosts,
      joinRequestRepo,
      requirementChecker
    );
    sendJoinRequestService.sendJoinRequest({
      userId: user.id,
      postId: post.id,
      roleId: post.roles[0].id,
    });

    return sendJoinRequestService;
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
