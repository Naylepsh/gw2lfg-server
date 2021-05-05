import { User } from "@root/data/entities/user/user.entity";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class UserMemoryRepository
  extends IdentifiableMemoryRepository<User>
  implements IUserRepository {
  async findByUsername(username: string): Promise<User | undefined> {
    for (const user of this.entities) {
      if (user.username === username) {
        return user;
      }
    }

    return undefined;
  }
}
