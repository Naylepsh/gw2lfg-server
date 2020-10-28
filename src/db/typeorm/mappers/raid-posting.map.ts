import { RaidPosting as DomainPosting } from "../../../models/postings/raid-posting.model";
import { RaidPosting as PersistancePosting } from "../entities/raid-posting.entitity";
import { postingMap } from "./posting.map";
import { raidBossMap } from "./raid-boss.map";

export const toPersistance = (posting: DomainPosting) => {
  const p = postingMap.toPersistance(posting) as PersistancePosting;
  p.bosses = posting.bosses.map(raidBossMap.toPersistance);

  return p;
};

export const toDomain = (posting: PersistancePosting) => {
  const p = postingMap.toDomain(posting);
  const bosses = posting.bosses.map(raidBossMap.toDomain);

  return DomainPosting.fromPosting(p, bosses);
};
