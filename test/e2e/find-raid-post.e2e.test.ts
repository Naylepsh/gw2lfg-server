import "reflect-metadata";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { loadDependencies } from "@loaders/index";
import { types } from "@loaders/typedi.constants";
import request from "supertest";
import Container from "typedi";
import { Connection } from "typeorm";
import { clean, seedRaidBoss, seedRaidPost, seedUser } from "./seeders";
import { UserRepository } from "@data/repositories/user/user.repository";

describe("Find raid post e2e tests", () => {
  const timelimit = 60000;
  let app: any;
  let conn: Connection;
  let uow: IRaidPostUnitOfWork;
  let postId: number;

  beforeAll(async () => {
    ({ app, conn } = await loadDependencies({ loadTasks: false }));

    uow = Container.get(types.uows.raidPost);
  });

  beforeEach(async () => {
    const { token } = await seedUser(app);
    const bossesIds = [await seedRaidBoss(Container)];
    ({ id: postId } = await seedRaidPost(app, bossesIds, token));
  }, timelimit);

  afterEach(async () => {
    await clean(uow, conn.getCustomRepository(UserRepository));
  });

  afterAll(async () => {
    await conn.close();
  });

  it(
    "should find a seeded post",
    async () => {
      const { body } = await request(app).get(toUrl(postId));

      const post = body.data;
      expect(post).toHaveProperty("id", postId);
    },
    timelimit
  );

  function toUrl(id: number) {
    return `/raid-posts/${id}`;
  }
});
