import { User } from "../../../entities/user.entity";
import { IUserRepository } from "../../../repositories/user.repository";
import { turnIntoPromise } from "../turn-into-promise";
import { MemoryRepository } from "./memory-repository";

export class UserMemoryRepository
  extends MemoryRepository<User>
  implements IUserRepository {
  findByUsername(username: string): Promise<User | undefined> {
    return turnIntoPromise<User | undefined>(() => {
      for (const [_id, user] of this.entities) {
        if (user.username === username) {
          return user;
        }
      }

      return undefined;
    });
  }
}
