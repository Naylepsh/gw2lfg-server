import { IIdentifiableEntityRepository } from "./repository.interface";
import { User } from "../entities/user.entity";
import { IdentifiableEntityRepository } from "./generic.repository";
import { EntityRepository } from "typeorm";

export interface IUserRepository extends IIdentifiableEntityRepository<User> {
  findByUsername(username: string): Promise<User | undefined>;
}

@EntityRepository(User)
export class UserRepository
  extends IdentifiableEntityRepository<User>
  implements IUserRepository {
  findByUsername(username: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { username } });
  }
}
