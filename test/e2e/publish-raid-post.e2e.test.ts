import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "@loaders/index";
import {
  raidPostRepositoryType,
  raidPostUnitOfWorkType,
} from "@loaders/typedi.constants";
import { addHours } from "../unit/services/raid-post/hours.util";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { IRaidPostRepository } from "@data/repositories/raid-post/raid-post.repository.interface";
import { seedUserAndGetToken, seedRaidBoss, clean } from "./seeders";

describe("Publish raid post e2e tests", () => {
  const publishUrl = "/raid-posts";
  let container: typeof Container;
  let app: any;
  let uow: IRaidPostUnitOfWork;
  let token: string;
  let bossesIds: number[];

  beforeEach(async () => {
    ({ app, container } = await loadDependencies());

    uow = container.get(raidPostUnitOfWorkType);

    token = await seedUserAndGetToken(app);
    bossesIds = [await seedRaidBoss(container)];
  });

  afterEach(async () => {
    await clean(uow);
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
});