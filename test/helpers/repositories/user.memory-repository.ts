import { User } from "@root/data/entities/user/user.entity";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { turnIntoPromise } from "../turn-into-promise";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class UserMemoryRepository
  extends IdentifiableMemoryRepository<User>
  implements IUserRepository {
  findByUsername(username: string): Promise<User | undefined> {
    return turnIntoPromise<User | undefined>(() => {
      for (const user of this.entities) {
        if (user.username === username) {
          return user;
        }
      }

      return undefined;
    });
  }
}
