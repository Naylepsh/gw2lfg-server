import { User } from "../../entities/user.entity";
import { IdentifiableEntityRepository } from "../generic.repository";
import { EntityRepository } from "typeorm";
import { IUserRepository } from "./user.repository.interface";

@EntityRepository(User)
export class UserRepository
  extends IdentifiableEntityRepository<User>
  implements IUserRepository {
  findByUsername(username: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { username } });
  }
}
