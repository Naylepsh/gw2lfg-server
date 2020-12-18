import dotenv from "dotenv";
import { getConnection } from "typeorm";
import { RaidBossRepository } from "@data/repositories/raid-boss/raid-boss.repository";
import { loadTypeORM } from "@loaders/typeorm.loader";
import { raids } from "@data/entities/gw2-raids.json";
import { RaidBoss } from "@data/entities/raid-boss.entity";

dotenv.config({ path: "./.env.dev" });

const main = async () => {
  await loadTypeORM();
  const conn = getConnection();
  const raidBossRepo = conn.getCustomRepository(RaidBossRepository);

  const raidBossesInDb = await raidBossRepo.findMany({});

  const missingBosses = addMissingBosses(raidBossesInDb);

  await raidBossRepo.saveMany(missingBosses);

  console.log(`found ${raidBossesInDb.length} bosses in database.`);
  console.log(`added ${missingBosses.length} bosses.`);
};

const addMissingBosses = (raidBossesInDb: RaidBoss[]) => {
  const encounters: RaidBoss[] = [];

  for (const raid of raids) {
    for (const encounter of raid.encounters) {
      const raidBoss = new RaidBoss({ name: encounter.name, isCm: false });
      addBossIfNeeded(raidBossesInDb, raidBoss, encounters);

      if (encounter.hasCm) {
        const raidBoss = new RaidBoss({ name: encounter.name, isCm: true });
        addBossIfNeeded(raidBossesInDb, raidBoss, encounters);
      }
    }
  }

  return encounters;
};

const addBossIfNeeded = (
  raidBossesInDb: RaidBoss[],
  raidBoss: RaidBoss,
  encounters: RaidBoss[]
) => {
  if (!raidBossesInDb.some((boss) => boss.equals(raidBoss))) {
    encounters.push(raidBoss);
  }
};

main();
