import { User } from "../../entities/user/user.entity";
import { IdentifiableEntityRepository } from "../generic-identifiable-entity.repository";
import { EntityRepository } from "typeorm";
import { IUserRepository } from "./user.repository.interface";
import { Service } from "typedi";

@Service()
@EntityRepository(User)
export class UserRepository
  extends IdentifiableEntityRepository<User>
  implements IUserRepository {
  findByUsername(username: string): Promise<User | undefined> {
    // find an user with matching username (since username is unique there should be at most 1 result)
    return this.repository.findOne({ where: { username } });
  }
}
