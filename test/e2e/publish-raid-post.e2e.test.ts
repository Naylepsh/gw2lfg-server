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
import { seedRaidBoss, clean, seedUser } from "./seeders";

describe("Publish raid post e2e tests", () => {
  const publishUrl = "/raid-posts";
  const timeLimit = 15000;
  let app: any;
  let uow: IRaidPostUnitOfWork;
  let token: string;
  let bossesIds: number[];

  beforeEach(async () => {
    ({ app } = await loadDependencies());

    uow = Container.get(raidPostUnitOfWorkType);

    ({ token } = await seedUser(app));
    bossesIds = [await seedRaidBoss(Container)];
  }, timeLimit);

  afterEach(async () => {
    await clean(uow);
  });

  it(
    "should create a raid post",
    async () => {
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

      const raidPostRepo: IRaidPostRepository = Container.get(
        raidPostRepositoryType
      );
      const postInDbAfer = await raidPostRepo.findById(body.data.id);
      expect(postInDbAfer).toBeDefined();
      expect(postInDbAfer).toHaveProperty("server", post.server);
    },
    timeLimit
  );
});
