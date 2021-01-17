import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "@loaders/index";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { seedRaidBoss, seedRaidPost, clean, seedUser } from "./seeders";

describe("Find raid posts e2e tests", () => {
  const timelimit = 60000;
  const findUrl = "/raid-posts";
  let app: any;
  let uow: IRaidPostUnitOfWork;
  let postId: number;

  beforeEach(async () => {
    ({ app } = await loadDependencies());

    uow = Container.get(raidPostUnitOfWorkType);

    const { token } = await seedUser(app);
    const bossesIds = [await seedRaidBoss(Container)];
    ({ id: postId } = await seedRaidPost(app, bossesIds, token));
  }, timelimit);

  afterEach(async () => {
    await clean(uow);
  });

  it(
    "should find a seeded post",
    async () => {
      const { body } = await request(app).get(findUrl);

      const posts = body.data;
      expect(posts.length).toBe(1);
      expect(posts[0]).toHaveProperty("id", postId);
    },
    timelimit
  );
});
