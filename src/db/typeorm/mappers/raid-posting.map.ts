import { RaidPosting as DomainPosting } from "../../../models/postings/raid-posting.model";
import { RaidPosting as PersistancePosting } from "../entities/raid-posting.entitity";
import { Mapper } from "./map.type";
import { postingMap } from "./posting.map";
import { raidBossMap } from "./raid-boss.map";

export const toPersistence: Mapper<DomainPosting, PersistancePosting> = (
  posting: DomainPosting
) => {
  const p = postingMap.toPersistence(posting) as PersistancePosting;
  p.bosses = posting.bosses.map(raidBossMap.toPersistence);

  return p;
};

export const toDomain: Mapper<PersistancePosting, DomainPosting> = (
  posting: PersistancePosting
) => {
  const p = postingMap.toDomain(posting);
  const bosses = posting.bosses.map(raidBossMap.toDomain);

  return DomainPosting.fromPosting(p, bosses);
};
