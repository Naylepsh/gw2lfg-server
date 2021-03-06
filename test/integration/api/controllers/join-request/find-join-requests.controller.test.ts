import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import items from "@services/gw2-api/items/items.json";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { User } from "@root/data/entities/user/user.entity";
import { CreateJoinRequestService } from "@root/services/join-request/create-join-request.service";
import { GetItems } from "@root/services/gw2-api/items/get-items.fetcher";
import { FindJoinRequestsService } from "@services/join-request/find-join-requests.service";
import { FindJoinRequestsController } from "@api/controllers/join-requests/find-join-requests.controller";
import { createExpressServer, useContainer } from "routing-controllers";
import { JoinRequestMemoryRepository } from "../../../../common/repositories/join-request.memory-repository";
import { RaidPostMemoryUnitOfWork } from "../../../../common/uows/raid-post.memory-unit-of-work";
import { MyStorage } from "../../../../unit/services/item-storage";
import { seedDbWithOnePost } from "../raid-post/seed-db";
import { CheckItemRequirementsService } from "@root/services/requirement/check-item-requirements.service";
import { FindUserItemsService } from "@services/user/find-user-items.service";
import { GW2ApiItem } from "@services/gw2-api/items/item.interface";
import { NotificationMemoryRepository } from "../../../../common/repositories/notification.memory-repository";
import { CreateNotificationService } from "@services/notification/create-notification.service";

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
    const findUserItemsService = new FindUserItemsService(
      uow.users,
      new GetItems(myStorage.fetch.bind(myStorage))
    );
    const requirementChecker = new CheckItemRequirementsService(
      findUserItemsService
    );
    const notificationRepo = new NotificationMemoryRepository();
    const notificationService = new CreateNotificationService(notificationRepo);
    const sendJoinRequestService = new CreateJoinRequestService(
      uow.users,
      uow.raidPosts,
      joinRequestRepo,
      requirementChecker,
      notificationService
    );
    await sendJoinRequestService.create({
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
