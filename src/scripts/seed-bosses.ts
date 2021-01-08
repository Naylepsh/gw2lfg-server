import "module-alias/register"; // needed for usage of module aliases
import dotenv from "dotenv";
import path from "path";
import { getConnection } from "typeorm";
import { RaidBossRepository } from "@data/repositories/raid-boss/raid-boss.repository";
import { loadTypeORM } from "@loaders/typeorm.loader";
import { raids } from "@data/entities/raid-boss/gw2-raids.json";
import { RaidBoss } from "@data/entities/raid-boss/raid-boss.entity";

const env = process.env.NODE_ENV || "dev";

const pathToConfigFile = path.join(__dirname, `../../.env.${env}`);
dotenv.config({ path: pathToConfigFile });

/*
Script that seeds the database with raid bosses
*/
const main = async () => {
  await loadTypeORM();
  const conn = getConnection();
  const raidBossRepo = conn.getCustomRepository(RaidBossRepository);

  const raidBossesInDb = await raidBossRepo.findMany({});

  const missingBosses = addMissingBosses(raidBossesInDb);

  await raidBossRepo.saveMany(missingBosses);

  console.log(`Found ${raidBossesInDb.length} bosses in database.`);
  console.log(`Added ${missingBosses.length} bosses.`);
};

/*
Checks which bosses are missing from the given array
*/
const addMissingBosses = (raidBossesInDb: RaidBoss[]) => {
  const encounters: RaidBoss[] = [];

  for (const raid of raids) {
    for (const encounter of raid.encounters) {
      const raidBoss = new RaidBoss({ name: encounter.name, isCm: false });
      addBossIfNeeded(raidBossesInDb, raidBoss, encounters);

      // we treat raid boss with normal mode and the same raid boss but with challenge mode enabled
      // as different entities
      if (encounter.hasCm) {
        const raidBoss = new RaidBoss({ name: encounter.name, isCm: true });
        addBossIfNeeded(raidBossesInDb, raidBoss, encounters);
      }
    }
  }

  return encounters;
};

/*
If raidBossesInDb does not contain raidBoss, puts it in encounters
*/
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
