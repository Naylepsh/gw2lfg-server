import { User } from "../../../../entities/user.entity";
import { IUserRepository } from "../../../../repositories/user.repository";
import { register } from "../../../../services/user/register";
import { Hash } from "../../../../utils/hashing/hashing.types";

export const turnIntoPromise = <T>(fn: () => T) =>
  new Promise<T>((resolve) => resolve(fn()));

export class UserMemoryRepository implements IUserRepository {
  nextId = 0;
  readonly users = new Map<number, User>();

  constructor(users: User[] = []) {
    for (const user of users) {
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

const simpleHash: Hash = (text: string) => turnIntoPromise(() => text + "123");

describe("User service: register tests", () => {
  it("should save an user", async () => {
    const userRepository = new UserMemoryRepository();
    const user = new User("username", "password", "api-key");

    await register(user, userRepository, simpleHash);

    const userInDb = await userRepository.findByUsername("username");
    expect(userInDb).not.toBeUndefined();
  });

  it("should hash password", async () => {
    const userRepository = new UserMemoryRepository();
    const user = new User("username", "password", "api-key");

    await register(user, userRepository, simpleHash);

    const userInDb = await userRepository.findByUsername(user.username);
    expect(userInDb!.password).not.toEqual(user.password);
  });

  it("should not allow registration if username is taken", async () => {
    const user = new User("username", "password", "api-key");
    const userRepository = new UserMemoryRepository([user]);

    expect(register(user, userRepository, simpleHash)).rejects.toThrow();
  });
});
