import { IRepository } from "./repository.interface";
import { User } from "../entities/user.entity";
import { GenericRepository } from "./generic.repository";
import { EntityRepository } from "typeorm";

export interface IUserRepository extends IRepository<User> {
  findByUsername(username: string): Promise<User | undefined>;
}

@EntityRepository(User)
export class UserRepository
  extends GenericRepository<User>
  implements IUserRepository {
  findByUsername(username: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { username } });
  }
}