import "reflect-metadata";
import request from "supertest";
import { createExpressServer, Action, useContainer } from "routing-controllers";
import Container from "typedi";
import { UnpublishRaidPostController } from "../../../../api/controllers/raid-post/unpublish.controller";
import { CurrentUserMiddleware } from "../../../../api/middleware/current-user.middleware";
import { RaidBoss } from "../../../../data/entities/raid-boss.entity";
import { User } from "../../../../data/entities/user.entity";
import { PostAuthorshipService } from "../../../../services/raid-post/authorship.service";
import { PublishRaidPostService } from "../../../../services/raid-post/publish.service";
import { UnpublishRaidPostService } from "../../../../services/raid-post/unpublish.service";
import { RegisterService } from "../../../../services/user/register";
import { RaidBossMemoryRepository } from "../../../helpers/repositories/raid-boss.memory-repository";
import { RaidPostMemoryRepository } from "../../../helpers/repositories/raid-post.memory-repository";
import { RequirementMemoryRepository } from "../../../helpers/repositories/requirement.memory-repository";
import { RoleMemoryRepository } from "../../../helpers/repositories/role.memory-repository";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { addHours } from "../../../unit/services/raid-post/hours.util";

describe("UnpublishRaidPostController integration tests", () => {
  let url = "/raid-posts";
  let postId: number;
  let uow: RaidPostMemoryUnitOfWork;
  let registerService: RegisterService;
  let token: string;
  let app: any;

  beforeEach(async () => {
    uow = new RaidPostMemoryUnitOfWork(
      new UserMemoryRepository(),
      new RaidBossMemoryRepository(),
      new RoleMemoryRepository(),
      new RequirementMemoryRepository(),
      new RaidPostMemoryRepository()
    );

    registerService = new RegisterService(uow.users);
    const author = new User({
      username: "existingUser",
      password: "password",
      apiKey: "api-key",
    });
    const { id: userid } = await registerService.register(author);
    token = userid.toString();

    const boss = new RaidBoss({ name: "boss", isCm: false });
    const savedBoss = await uow.raidBosses.save(boss);
    const bossesIds = [savedBoss.id];

    const publishService = new PublishRaidPostService(uow);
    const dto = {
      server: "EU",
      date: addHours(new Date(), 12),
      bossesIds,
      rolesProps: [],
      requirementsProps: [],
      authorId: userid,
    };
    const post = await publishService.publish(dto);
    postId = post.id;

    const unpublishService = new UnpublishRaidPostService(uow);
    const authorshipService = new PostAuthorshipService(uow.raidPosts);
    const controller = new UnpublishRaidPostController(
      unpublishService,
      authorshipService
    );

    Container.set(UnpublishRaidPostController, controller);
    useContainer(Container);

    const currentUserMiddleware = new CurrentUserMiddleware(uow.users);

    app = createExpressServer({
      controllers: [UnpublishRaidPostController],
      currentUserChecker: async (action: Action) =>
        await currentUserMiddleware.getCurrentUser(action),
    });
  });

  it("should return 401 if user was not logged in", async () => {
    const res = await request(app).delete(toUrl(postId));

    expect(res.status).toBe(401);
  });

  it("should return 403 if user is not the author", async () => {
    const otherUser = new User({
      username: "otherUser",
      password: "password",
      apiKey: "api-key",
    });
    const { id: otherUserId } = await registerService.register(otherUser);
    const otherUserToken = otherUserId.toString();

    const res = await request(app)
      .delete(toUrl(postId))
      .set(CurrentUserMiddleware.AUTH_HEADER, otherUserToken);

    expect(res.status).toBe(403);
  });

  it("should return 204 if valid data was passed", async () => {
    const res = await request(app)
      .delete(toUrl(postId))
      .set(CurrentUserMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(204);
  });

  it("should return 204 if post does not exists", async () => {
    await request(app)
      .delete(toUrl(postId))
      .set(CurrentUserMiddleware.AUTH_HEADER, token);
    const res = await request(app)
      .delete(toUrl(postId))
      .set(CurrentUserMiddleware.AUTH_HEADER, token);

    expect(res.status).toBe(204);
  });

  it("should remove a post if it existed", async () => {
    await request(app)
      .delete(toUrl(postId))
      .set(CurrentUserMiddleware.AUTH_HEADER, token);

    expect(uow.committed).toBeTruthy();
  });

  const toUrl = (id: number) => `${url}/${id}`;
});
