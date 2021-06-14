import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "@loaders/index";
import { types } from "@loaders/typedi.constants";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { seedRaidBoss, seedRaidPost, clean, seedUser } from "./seeders";
import { AUTH_HEADER, toBearerToken } from "../common/to-bearer-token";
import { Connection } from "typeorm";
import { UserRepository } from "@data/repositories/user/user.repository";
import { NotificationRepository } from "@data/repositories/notification/notification.repository";

describe("Delete raid post e2e tests", () => {
  const url = "/raid-posts";
  let app: any;
  let conn: Connection;
  let uow: IRaidPostUnitOfWork;
  let token: string;
  let postId: number;

  beforeAll(async () => {
    ({ app, conn } = await loadDependencies({ loadTasks: false }));

    uow = Container.get(types.uows.raidPost);
  });

  beforeEach(async () => {
    ({ token } = await seedUser(app));
    const bossesIds = [await seedRaidBoss(Container)];
    ({ id: postId } = await seedRaidPost(app, bossesIds, token));
  });

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

  it("should remove a raid post", async () => {
    await request(app)
      .delete(toUrl(postId))
      .set(AUTH_HEADER, toBearerToken(token));
    const { body } = await request(app).get(url);
    const posts = body.data;

    expect(posts.length).toBe(0);
  });

  const toUrl = (id: number) => `${url}/${id}`;
});
