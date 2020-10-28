import { RaidBoss as PersistanceRaidBoss } from "../entities/raid-boss.entity";
import { RaidBoss as DomainRaidBoss } from "../../../models/postings/raid-posting.model";

export const toPersistance = (raidBoss: DomainRaidBoss) => {
  const boss = new PersistanceRaidBoss();
  boss.name = raidBoss.name;
  boss.cm = raidBoss.cm;

  return boss;
};

export const toDomain = (raidBoss: PersistanceRaidBoss) => {
  return { name: raidBoss.name, cm: raidBoss.cm };
};

export const raidBossMap = { toPersistance, toDomain };
