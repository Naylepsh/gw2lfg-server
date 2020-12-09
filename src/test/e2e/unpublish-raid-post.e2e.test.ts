import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "../../loaders";
import { raidPostUnitOfWorkType } from "../../loaders/typedi.constants";
import { IRaidPostUnitOfWork } from "../../data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { CurrentUserJWTMiddleware } from "../../api/middleware/current-user.middleware";
import { seedUserAndGetToken, seedRaidBoss, seedRaidPost } from "./seeders";

describe("Unpublish raid post e2e tests", () => {
  const raidPostsUrl = "/raid-posts";
  let app: any;
  let uow: IRaidPostUnitOfWork;
  let token: string;
  let postId: number;

  beforeEach(async () => {
    let container: typeof Container;
    ({ app, container } = await loadDependencies());

    uow = container.get(raidPostUnitOfWorkType);

    token = await seedUserAndGetToken(app);
    const bossesIds = [await seedRaidBoss(container)];
    ({ id: postId } = await seedRaidPost(app, bossesIds, token));
  });

  afterEach(async () => {
    await uow.withTransaction(async () => {
      await uow.raidPosts.delete({});
      await uow.users.delete({});
      await uow.raidBosses.delete({});
      await uow.requirements.delete({});
      await uow.roles.delete({});
    });
  });

  it("should remove a raid post", async () => {
    const { status, body } = await request(app)
      .delete(toUrl(postId))
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);
    console.log({ status, body });
    const { body: posts } = await request(app).get(raidPostsUrl);

    expect(posts.length).toBe(0);
  });

  const toUrl = (id: number) => `${raidPostsUrl}/${id}`;
});
