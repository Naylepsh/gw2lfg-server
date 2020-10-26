import { getRepository } from "typeorm";
import { IRepository } from "../../repository";
import { User } from "../entities/user.entity.typeorm";

export class UserRepository implements IRepository<User> {
  save(user: User): Promise<User> {
    return this.getRepo().save(user);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.getRepo().findOne(id);
    return user ? user : null;
  }

  private getRepo() {
    return getRepository(User);
  }
}
