import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { loadDependencies } from "@loaders/index";
import { types } from "@loaders/typedi.constants";
import { clean, seedRaidBoss, seedRaidPost, seedUser } from "./seeders";
import { AUTH_HEADER, toBearerToken } from "../common/to-bearer-token";
import { Connection } from "typeorm";

describe("Find raid post join request e2e tests", () => {
  const url = "/join-requests";
  const timelimit = 60000;
  let app: any;
  let conn: Connection;
  let uow: IRaidPostUnitOfWork;
  let post: RaidPost;
  let token: string;

  beforeAll(async () => {
    ({ app, conn } = await loadDependencies({ loadTasks: false }));

    uow = Container.get(types.uows.raidPost);
  });

  beforeEach(async () => {
    ({ token } = await seedUser(app));
    const bossesIds = [await seedRaidBoss(Container)];
    post = await seedRaidPost(app, bossesIds, token);
  }, timelimit);

  afterEach(async () => {
    await clean(uow);
  });

  afterAll(async () => {
    await conn.close();
  });

  it(
    "should find a join request",
    async () => {
      const roleId = post.roles[0].id;
      await request(app)
        .post(url)
        .send({ roleId, postId: post.id })
        .set(AUTH_HEADER, toBearerToken(token));

      const { body } = await request(app).get(`${url}?roleId=${roleId}`);
      const joinRequests = body.data;

      expect(joinRequests.length).toBe(1);
    },
    timelimit
  );
});
