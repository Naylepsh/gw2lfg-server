import { User } from "../../entities/user.entity";
import { IdentifiableEntityRepository } from "../generic.repository";
import { EntityRepository } from "typeorm";
import { IUserRepository } from "./user.repository.interface";
import { Service } from "typedi";

@Service("user.repository")
@EntityRepository(User)
export class UserRepository
  extends IdentifiableEntityRepository<User>
  implements IUserRepository {
  findByUsername(username: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { username } });
  }
}
