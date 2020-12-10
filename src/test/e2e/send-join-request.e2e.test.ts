import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "../../loaders";
import {
  joinRequestRepositoryType,
  raidPostUnitOfWorkType,
} from "../../loaders/typedi.constants";
import { IRaidPostUnitOfWork } from "../../data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { CurrentUserJWTMiddleware } from "../../api/middleware/current-user.middleware";
import {
  seedUserAndGetToken,
  seedRaidBoss,
  seedRaidPost,
  clean,
} from "./seeders";
import { RaidPost } from "../../data/entities/raid-post.entitity";
import { IJoinRequestRepository } from "../../data/repositories/join-request/join-request.repository.interface";

describe("Send raid post join request e2e tests", () => {
  const postsUrl = "/raid-posts";
  const timelimit = 30000;
  let container: typeof Container;
  let app: any;
  let uow: IRaidPostUnitOfWork;
  let joinRequestRepo: IJoinRequestRepository;
  let token: string;
  let post: RaidPost;

  beforeEach(async () => {
    ({ app, container } = await loadDependencies());

    uow = container.get(raidPostUnitOfWorkType);
    joinRequestRepo = container.get(joinRequestRepositoryType);

    token = await seedUserAndGetToken(app);
    const bossesIds = [await seedRaidBoss(container)];
    post = await seedRaidPost(app, bossesIds, token);
  });

  afterEach(async () => {
    await joinRequestRepo.delete({});
    await clean(uow);
  });

  it(
    "should create a join request",
    async () => {
      const roleId = post.roles[0].id;
      await request(app)
        .post(`${postsUrl}/${post.id}/join-request`)
        .set(CurrentUserJWTMiddleware.AUTH_HEADER, token)
        .send({ roleId });

      const joinRequests = await joinRequestRepo.findMany({});
      expect(joinRequests.length).toBe(1);
    },
    timelimit
  );
});
