import { User } from "../../entities/user/user.entity";
import { AbstractRepository, EntityRepository } from "typeorm";
import { IUserRepository, UserQueryParams } from "./user.repository.interface";
import { Service } from "typedi";

@Service()
@EntityRepository(User)
export class UserRepository
  extends AbstractRepository<User>
  implements IUserRepository {
  save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  findOne(params: UserQueryParams): Promise<User | undefined> {
    return this.repository.findOne(params);
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria);
  }
}
