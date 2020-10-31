import { RaidBoss as PersistenceRaidBoss } from "../entities/raid-boss.entity";
import { RaidBoss as DomainRaidBoss } from "../../../models/postings/raid-posting.model";
import { Mapper } from "./map.type";

export const toPersistence: Mapper<DomainRaidBoss, PersistenceRaidBoss> = (
  raidBoss: DomainRaidBoss
) => {
  const boss = new PersistenceRaidBoss();
  boss.name = raidBoss.name;
  boss.cm = raidBoss.cm;

  return boss;
};

export const toDomain: Mapper<PersistenceRaidBoss, DomainRaidBoss> = (
  raidBoss: PersistenceRaidBoss
) => {
  return { name: raidBoss.name, cm: raidBoss.cm };
};

export const raidBossMap = { toPersistence, toDomain };
