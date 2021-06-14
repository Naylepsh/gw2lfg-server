import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "@loaders/index";
import { types } from "@loaders/typedi.constants";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { seedRaidBoss, seedRaidPost, clean, seedUser } from "./seeders";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { SaveRaidPostDTO } from "@root/api/controllers/raid-posts/dtos/save-raid-post.dto";
import { AUTH_HEADER, toBearerToken } from "../common/to-bearer-token";
import { Connection } from "typeorm";
import { UserRepository } from "@data/repositories/user/user.repository";
import { NotificationRepository } from "@data/repositories/notification/notification.repository";

describe("Update raid post e2e tests", () => {
  const url = "/raid-posts";
  let app: any;
  let conn: Connection;
  let uow: IRaidPostUnitOfWork;
  let token: string;
  let post: RaidPost;

  beforeAll(async () => {
    ({ app, conn } = await loadDependencies({ loadTasks: false }));

    uow = Container.get(types.uows.raidPost);
  });

  beforeEach(async () => {
    ({ token } = await seedUser(app));
    const bossesIds = [await seedRaidBoss(Container)];
    post = await seedRaidPost(app, bossesIds, token);
  });

  afterEach(async () => {
    await clean(uow, conn.getCustomRepository(UserRepository), conn.getCustomRepository(NotificationRepository));
  });

  afterAll(async () => {
    await conn.close();
  });

  it("should update a raid post", async () => {
    const postDto: SaveRaidPostDTO = {
      date: post.date.toISOString(),
      server: post.server,
      description: "a very different description",
      bossesIds: post.bosses.map((boss) => boss.id),
      rolesProps: [{ name: "dps", class: "warrior" }],
      requirementsProps: { itemsProps: [] },
    };
    await request(app)
      .put(toUrl(post.id))
      .send(postDto)
      .set(AUTH_HEADER, toBearerToken(token));
    const { body } = await request(app).get(url);

    const posts = body.data;
    expect(posts.length).toBe(1);
    expect(posts[0]).toHaveProperty("description", postDto.description);
  });

  const toUrl = (id: number) => `${url}/${id}`;
});
