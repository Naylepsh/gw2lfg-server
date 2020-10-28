import { User as DomainUser } from "../../../models/user.model";
import { User as PersistanceUser } from "../entities/user.entity";

export const toPersistance = (user: DomainUser) => {
  const usr = new PersistanceUser();
  usr.username = user.username;
  usr.password = user.password;
  usr.apiKey = user.apiKey;

  return usr;
};

export const toDomain = (user: PersistanceUser) => {
  return new DomainUser(user.id, user.username, user.password, user.apiKey);
};

export const userMap = { toPersistance, toDomain };
