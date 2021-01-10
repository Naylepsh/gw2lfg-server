import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { loadDependencies } from "@loaders/index";
import {
  joinRequestRepositoryType,
  raidPostUnitOfWorkType,
} from "@loaders/typedi.constants";
import { clean, seedRaidBoss, seedRaidPost, seedUser } from "./seeders";
import { JoinRequestStatus } from "../data/entities/join-request/join-request.status";

describe("Update join request e2e tests", () => {
  const joinRequestsUrl = "/join-requests";
  const timelimit = 60000;
  let app: any;
  let uow: IRaidPostUnitOfWork;
  let joinRequestRepo: IJoinRequestRepository;
  let token: string;
  let post: RaidPost;

  beforeEach(async () => {
    ({ app } = await loadDependencies());

    uow = Container.get(raidPostUnitOfWorkType);
    joinRequestRepo = Container.get(joinRequestRepositoryType);

    ({ token } = await seedUser(app));
    const bossesIds = [await seedRaidBoss(Container)];
    post = await seedRaidPost(app, bossesIds, token);
  }, timelimit);

  afterEach(async () => {
    await clean(uow);
  });

  it(
    "should update a join request",
    async () => {
      const roleId = post.roles[0].id;
      const createRequestResponse = await request(app)
        .post(joinRequestsUrl)
        .set(CurrentUserJWTMiddleware.AUTH_HEADER, token)
        .send({ roleId, postId: post.id });
      const requestId = createRequestResponse.body.data.id;

      const newStatus: JoinRequestStatus = "ACCEPTED";
      await request(app)
        .put(`${joinRequestsUrl}/${requestId}`)
        .set(CurrentUserJWTMiddleware.AUTH_HEADER, token)
        .send({ status: newStatus });

      const { body } = await request(app).get(
        `${joinRequestsUrl}/${requestId}`
      );
      const joinRequest = body.data;

      expect(joinRequest).toHaveProperty("status", newStatus);
    },
    timelimit
  );
});
