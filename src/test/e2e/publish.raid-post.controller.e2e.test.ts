import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { raids } from "../../data/entities/gw2-raids.json";
import { loadDependencies } from "../../loaders";
import {
  raidBossRepositoryType,
  raidPostRepositoryType,
  raidPostUnitOfWorkType,
} from "../../loaders/typedi.constants";
import { RaidBoss } from "../../data/entities/raid-boss.entity";
import { addHours } from "../unit/services/raid-post/hours.util";
import { IRaidPostUnitOfWork } from "../../data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { CurrentUserJWTMiddleware } from "../../api/middleware/current-user.middleware";
import { IRaidBossRepository } from "../../data/repositories/raid-boss/raid-boss.repository.interface";
import { IRaidPostRepository } from "../../data/repositories/raid-post/raid-post.repository.interface";

describe("RegisterUserController e2e tests", () => {
  const publishUrl = "/raid-posts";
  let container: typeof Container;
  let app: any;
  let uow: IRaidPostUnitOfWork;
  let token: string;
  let bossesIds: number[];

  beforeEach(async () => {
    ({ app, container } = await loadDependencies());

    uow = container.get(raidPostUnitOfWorkType);

    token = await seedUser();
    bossesIds = [await seedRaidBoss()];
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

  it("should create a raid post", async () => {
    const post = {
      server: "EU",
      date: addHours(new Date(), 10),
      description: "bring potions and food",
      bossesIds,
    };

    const { body } = await request(app)
      .post(publishUrl)
      .send(post)
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    const raidPostRepo: IRaidPostRepository = container.get(
      raidPostRepositoryType
    );
    const postInDbAfer = await raidPostRepo.findById(body.id);
    expect(postInDbAfer).toBeDefined();
    expect(postInDbAfer).toHaveProperty("server", post.server);
  });

  const seedUser = async () => {
    const registerUrl = "/register";
    const loginUrl = "/login";

    const user = {
      username: "username",
      password: "password",
      apiKey: "ap1-k3y",
    };

    await request(app).post(registerUrl).send(user);
    const { body: token } = await request(app)
      .post(loginUrl)
      .send({ username: user.username, password: user.password });

    return token;
  };

  const seedRaidBoss = async () => {
    const encounter = raids[0].encounters[0];
    const boss = new RaidBoss({ name: encounter.name, isCm: false });
    const raidBossRepo: IRaidBossRepository = container.get(
      raidBossRepositoryType
    );
    const { id } = await raidBossRepo.save(boss);

    return id;
  };
});
