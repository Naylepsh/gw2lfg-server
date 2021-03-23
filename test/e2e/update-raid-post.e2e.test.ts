import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "@loaders/index";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { seedRaidBoss, seedRaidPost, clean, seedUser } from "./seeders";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { SaveRaidPostDTO } from "@root/api/controllers/raid-posts/dtos/save-raid-post.dto";
import { AUTH_HEADER, toBearerToken } from "../common/to-bearer-token";

describe("Update raid post e2e tests", () => {
  const url = "/raid-posts";
  let app: any;
  let uow: IRaidPostUnitOfWork;
  let token: string;
  let post: RaidPost;

  beforeEach(async () => {
    ({ app } = await loadDependencies());

    uow = Container.get(raidPostUnitOfWorkType);

    ({ token } = await seedUser(app));
    const bossesIds = [await seedRaidBoss(Container)];
    post = await seedRaidPost(app, bossesIds, token);
  });

  afterEach(async () => {
    await clean(uow);
  });

  it("should update a raid post", async () => {
    const postDto: SaveRaidPostDTO = {
      date: post.date,
      server: post.server,
      description: "a very different description",
      bossesIds: post.bosses.map((boss) => boss.id),
      rolesProps: [],
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
