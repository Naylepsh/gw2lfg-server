import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { loadDependencies } from "@loaders/index";
import { raidBossRepositoryType } from "@loaders/typedi.constants";
import { IRaidBossRepository } from "@data/repositories/raid-boss/raid-boss.repository.interface";
import { seedRaidBoss } from "./seeders";

describe("Find raid posts e2e tests", () => {
  const findUrl = "/raid-bosses";
  let app: any;
  let raidBossRepo: IRaidBossRepository;
  let bossId: number;

  beforeEach(async () => {
    ({ app } = await loadDependencies());

    raidBossRepo = Container.get(raidBossRepositoryType);

    bossId = await seedRaidBoss(Container);
  });

  afterEach(async () => {
    await raidBossRepo.delete({});
  });

  it("should find a seeded post", async () => {
    const { body } = await request(app).get(findUrl);

    const bosses = body.data;
    expect(bosses.length).toBe(1);
    expect(bosses[0]).toHaveProperty("id", bossId);
  });
});
