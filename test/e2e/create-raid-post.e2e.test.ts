import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "@loaders/index";
import { types } from "@loaders/typedi.constants";
import { addHours } from "../common/hours.util";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { IRaidPostRepository } from "@data/repositories/raid-post/raid-post.repository.interface";
import { seedRaidBoss, clean, seedUser } from "./seeders";
import { AUTH_HEADER, toBearerToken } from "../common/to-bearer-token";
import { Connection } from "typeorm";
import { UserRepository } from "@data/repositories/user/user.repository";

describe("Create raid post e2e tests", () => {
  const url = "/raid-posts";
  const timeLimit = 15000;
  let app: any;
  let conn: Connection;
  let uow: IRaidPostUnitOfWork;
  let token: string;
  let bossesIds: number[];

  beforeAll(async () => {
    ({ app, conn } = await loadDependencies({ loadTasks: false }));

    uow = Container.get(types.uows.raidPost);
  });

  beforeEach(async () => {
    ({ token } = await seedUser(app));
    bossesIds = [await seedRaidBoss(Container)];
  }, timeLimit);

  afterEach(async () => {
    await clean(uow, conn.getCustomRepository(UserRepository));
  });

  afterAll(async () => {
    await conn.close();
  });

  it(
    "should create a raid post",
    async () => {
      const post = {
        server: "EU",
        date: addHours(new Date(), 10).toISOString(),
        description: "bring potions and food",
        bossesIds,
        rolesProps: [{ name: "dps", class: "warrior" }],
      };

      const { body } = await request(app)
        .post(url)
        .send(post)
        .set(AUTH_HEADER, toBearerToken(token));

      const raidPostRepo: IRaidPostRepository = Container.get(
        types.repositories.raidPost
      );
      const postInDbAfer = await raidPostRepo.findOne({
        where: { id: body.data.id },
      });
      expect(postInDbAfer).toBeDefined();
      expect(postInDbAfer).toHaveProperty("server", post.server);
    },
    timeLimit
  );
});
