import { User as DomainUser } from "../../../models/user.model";
import { User as PersistenceUser } from "../entities/user.entity";
import { Mapper } from "./map.type";

export const toPersistence: Mapper<DomainUser, PersistenceUser> = (
  user: DomainUser
) => {
  const usr = new PersistenceUser();
  usr.username = user.username;
  usr.password = user.password;
  usr.apiKey = user.apiKey;

  return usr;
};

export const toDomain: Mapper<PersistenceUser, DomainUser> = (
  user: PersistenceUser
) => {
  return new DomainUser(user.id, user.username, user.password, user.apiKey);
};

export const userMap = { toPersistence, toDomain };
