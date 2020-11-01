import { User } from "../../../../entities/user.entity";
import { IUserRepository } from "../../../../repositories/user.repository";
import { turnIntoPromise } from "./turn-into-promise";

export class UserMemoryRepository implements IUserRepository {
  nextId = 0;
  readonly users = new Map<number, User>();

  constructor(users: User[] = []) {
    for (const user of users) {
      user.id = this.nextId;
      this.users.set(this.nextId++, user);
    }
  }

  findByUsername(username: string): Promise<User | undefined> {
    return turnIntoPromise<User | undefined>(() => {
      for (const [_id, user] of this.users) {
        if (user.username === username) {
          return user;
        }
      }

      return undefined;
    });
  }

  save(entity: User): Promise<User> {
    return turnIntoPromise<User>(() => {
      const id = this.nextId;
      this.nextId++;

      entity.id = id;
      this.users.set(id, entity);

      return entity;
    });
  }

  findById(id: number): Promise<User | undefined> {
    return turnIntoPromise<User | undefined>(() => {
      return this.users.get(id);
    });
  }

  delete(_criteria?: any): Promise<void> {
    return turnIntoPromise<void>(() => {
      this.users.clear();
    });
  }
}
