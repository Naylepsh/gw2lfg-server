import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "@loaders/index";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import {
  seedUserAndGetToken,
  seedRaidBoss,
  seedRaidPost,
  clean,
} from "./seeders";

describe("Find raid post e2e tests", () => {
  const timelimit = 30000;
  let container: typeof Container;
  let app: any;
  let uow: IRaidPostUnitOfWork;
  let token: string;
  let postId: number;

  beforeEach(async () => {
    ({ app, container } = await loadDependencies());

    uow = container.get(raidPostUnitOfWorkType);

    token = await seedUserAndGetToken(app);
    const bossesIds = [await seedRaidBoss(container)];
    ({ id: postId } = await seedRaidPost(app, bossesIds, token));
  });

  afterEach(async () => {
    await clean(uow);
  });

  it(
    "should find a seeded post",
    async () => {
      const { body } = await request(app)
        .get(toUrl(postId))
        .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

      const post = body.data;
      expect(post).toHaveProperty("id", postId);
    },
    timelimit
  );

  function toUrl(id: number) {
    return `/raid-posts/${id}`;
  }
});
