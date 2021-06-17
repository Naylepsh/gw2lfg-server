import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "@loaders/index";
import { types } from "@loaders/typedi.constants";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { seedRaidBoss, seedRaidPost, clean, seedUser } from "./seeders";
import { Connection } from "typeorm";
import { UserRepository } from "@data/repositories/user/user.repository";
import { NotificationRepository } from "@data/repositories/notification/notification.repository";

describe("Find raid posts e2e tests", () => {
  const timelimit = 60000;
  const url = "/raid-posts";
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
    "should find a seeded post",
    async () => {
      const { body } = await request(app).get(url);

      const posts = body.data;
      expect(posts.length).toBe(1);
      expect(posts[0]).toHaveProperty("id", postId);
    },
    timelimit
  );
});
