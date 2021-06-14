import "module-alias/register"; // needed for usage of module aliases
import { RaidBossRepository } from "@data/repositories/raid-boss/raid-boss.repository";
import { loadTypeORM } from "@loaders/typeorm.loader";
import { raids } from "@data/entities/raid-boss/gw2-raids.json";
import { RaidBoss } from "@data/entities/raid-boss/raid-boss.entity";
import { loadEnv } from "../common/load-env";

/**
 * Script that seeds the database with raid bosses
 */
const main = async () => {
  loadEnv();
  const conn = await loadTypeORM();

  const raidBossRepo = conn.getCustomRepository(RaidBossRepository);

  const raidBossesInDb = await raidBossRepo.findMany({});

  const missingBosses = addMissingBosses(raidBossesInDb);

  await raidBossRepo.save(missingBosses);

  console.log(`Found ${raidBossesInDb.length} bosses in database.`);
  console.log(`Added ${missingBosses.length} bosses.`);
};

/**
 * Checks which bosses are missing from the given array
 */
const addMissingBosses = (raidBossesInDb: RaidBoss[]) => {
  const encounters: RaidBoss[] = [];

  for (const raid of raids) {
    for (const encounter of raid.encounters) {
      const raidBoss = new RaidBoss({ name: encounter.name, isCm: false });
      addBossIfNeeded(raidBossesInDb, raidBoss, encounters);

      /**
       * We treat raid boss with normal mode and the same raid boss but with challenge mode enabled
       * as different entities
       */
      if (encounter.hasCm) {
        const raidBoss = new RaidBoss({ name: encounter.name, isCm: true });
        addBossIfNeeded(raidBossesInDb, raidBoss, encounters);
      }
    }
  }

  return encounters;
};

/**
 * If raidBossesInDb does not contain raidBoss, puts it in encounters
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
