import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "@loaders/index";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { seedRaidBoss, seedRaidPost, clean, seedUser } from "./seeders";

describe("Find raid posts e2e tests", () => {
  const timelimit = 30000;
  const findUrl = "/raid-posts";
  let container: typeof Container;
  let app: any;
  let uow: IRaidPostUnitOfWork;
  let token: string;
  let postId: number;

  beforeEach(async () => {
    ({ app, container } = await loadDependencies());

    uow = container.get(raidPostUnitOfWorkType);

    ({ token } = await seedUser(app));
    const bossesIds = [await seedRaidBoss(container)];
    ({ id: postId } = await seedRaidPost(app, bossesIds, token));
  }, timelimit);

  afterEach(async () => {
    await clean(uow);
  });

  it(
    "should find a seeded post",
    async () => {
      const { body } = await request(app)
        .get(findUrl)
        .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

      const posts = body.data;
      expect(posts.length).toBe(1);
      expect(posts[0]).toHaveProperty("id", postId);
    },
    timelimit
  );
});
