import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "@loaders/index";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { seedRaidBoss, seedRaidPost, clean, seedUser } from "./seeders";

describe("Find raid post e2e tests", () => {
  const timelimit = 60000;
  let app: any;
  let uow: IRaidPostUnitOfWork;
  let token: string;
  let postId: number;

  beforeEach(async () => {
    ({ app } = await loadDependencies());

    uow = Container.get(raidPostUnitOfWorkType);

    ({ token } = await seedUser(app));
    const bossesIds = [await seedRaidBoss(Container)];
    ({ id: postId } = await seedRaidPost(app, bossesIds, token));
  }, timelimit);

  afterEach(async () => {
    await clean(uow);
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
