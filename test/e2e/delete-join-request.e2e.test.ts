import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { loadDependencies } from "@loaders/index";
import { types } from "@loaders/typedi.constants";
import { clean, seedRaidBoss, seedRaidPost, seedUser } from "./seeders";
import { AUTH_HEADER, toBearerToken } from "../common/to-bearer-token";
import { Connection } from "typeorm";
import { UserRepository } from "@data/repositories/user/user.repository";
import { NotificationRepository } from "@data/repositories/notification/notification.repository";

describe("Delete join request e2e tests", () => {
  const url = "/join-requests";
  const timelimit = 60000;
  let app: any;
  let conn: Connection;
  let uow: IRaidPostUnitOfWork;
  let joinRequestRepo: IJoinRequestRepository;
  let token: string;
  let post: RaidPost;

  beforeAll(async () => {
    ({ app, conn } = await loadDependencies({ loadTasks: false }));

    uow = Container.get(types.uows.raidPost);
    joinRequestRepo = Container.get(types.repositories.joinRequest);
  });

  beforeEach(async () => {
    ({ token } = await seedUser(app));
    const bossesIds = [await seedRaidBoss(Container)];
    post = await seedRaidPost(app, bossesIds, token);
  }, timelimit);

  afterEach(async () => {
    await clean(
      uow,
      conn.getCustomRepository(UserRepository),
      conn.getCustomRepository(NotificationRepository)
    );
  });

  afterAll(async () => {
    await conn.close();
  });

  it(
    "should delete a join request",
    async () => {
      const roleId = post.roles[0].id;
      const createRequestResponse = await request(app)
        .post(url)
        .set(AUTH_HEADER, toBearerToken(token))
        .send({ roleId, postId: post.id });
      const requestId = createRequestResponse.body.data.id;

      await request(app)
        .delete(`${url}/${requestId}`)
        .set(AUTH_HEADER, toBearerToken(token));

      await request(app).get(`${url}/${requestId}`);

      const joinRequest = await joinRequestRepo.findOne({
        where: { id: requestId },
      });

      expect(joinRequest).toBeUndefined();
    },
    timelimit
  );
});
