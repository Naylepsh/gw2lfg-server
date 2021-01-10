import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "@loaders/index";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { seedRaidBoss, seedRaidPost, clean, seedUser } from "./seeders";

describe("Unpublish raid post e2e tests", () => {
  const raidPostsUrl = "/raid-posts";
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
  });

  afterEach(async () => {
    await clean(uow);
  });

  it("should remove a raid post", async () => {
    await request(app)
      .delete(toUrl(postId))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);
    const { body } = await request(app).get(raidPostsUrl);
    const posts = body.data;

    expect(posts.length).toBe(0);
  });

  const toUrl = (id: number) => `${raidPostsUrl}/${id}`;
});
