import { IPosition } from "../../../models/positions/position.interface";
import { Posting as DomainPosting } from "../../../models/postings/posting.model";
import { Posting as PersistancePosting } from "../entities/posting.entity";
import { Mapper } from "./map.type";
import { requirementMap } from "./requirement.map";
import { userMap } from "./user.map";

export const toPersistence: Mapper<DomainPosting, PersistancePosting> = (
  posting: DomainPosting
) => {
  const p = new PersistancePosting();
  p.author = userMap.toPersistence(posting.author);
  p.date = posting.date;
  p.description = posting.description;
  p.server = posting.server;
  p.requirements = posting.requirements.map(requirementMap.toPersistence);

  return p;
};

export const toDomain: Mapper<PersistancePosting, DomainPosting> = (
  posting: PersistancePosting
) => {
  const author = userMap.toDomain(posting.author);
  const requirements = posting.requirements.map(requirementMap.toDomain);
  const positions: IPosition[] = [];

  return new DomainPosting(
    posting.id,
    author,
    posting.date,
    posting.server,
    posting.description,
    requirements,
    positions
  );
};

export const postingMap = { toPersistence, toDomain };
