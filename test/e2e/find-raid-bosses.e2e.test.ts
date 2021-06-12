import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "@loaders/index";
import { types } from "@loaders/typedi.constants";
import { IRaidBossRepository } from "@data/repositories/raid-boss/raid-boss.repository.interface";
import { seedRaidBoss } from "./seeders";
import { Connection } from "typeorm";

describe("Find raid posts e2e tests", () => {
  const url = "/raid-bosses";
  let app: any;
  let conn: Connection;
  let raidBossRepo: IRaidBossRepository;
  let bossId: number;

  beforeAll(async () => {
    ({ app, conn } = await loadDependencies({ loadTasks: false }));

    raidBossRepo = Container.get(types.repositories.raidBoss);
  });

  beforeEach(async () => {
    bossId = await seedRaidBoss(Container);
  });

  afterEach(async () => {
    await raidBossRepo.delete({});
  });

  afterAll(async () => {
    await conn.close();
  });

  it("should find a seeded post", async () => {
    const { body } = await request(app).get(url);

    const bosses = body.data;
    expect(bosses.length).toBe(1);
    expect(bosses[0]).toHaveProperty("id", bossId);
  });
});
