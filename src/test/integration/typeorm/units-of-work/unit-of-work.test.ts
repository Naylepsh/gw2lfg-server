import { Connection, getConnection } from "typeorm";
import { User } from "../../../../data/entities/user.entity";
import { loadTypeORM } from "../../../../loaders/typeorm.loader";
import { TypeOrmUnitOfWork } from "../../../../data/units-of-work/generic.unit-of-work";
import { UserRepository } from "../../../../data/repositories/user/user.repository";

describe("TypeORM Unit of Work tests", () => {
  let connection: Connection;

  beforeAll(async () => {
    await loadTypeORM();
  });

  beforeEach(() => {
    connection = getConnection();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should commit changes", async () => {
    const repo = connection.getCustomRepository(UserRepository);
    const uow = new TypeOrmUnitOfWork(connection);

    const work = async () => {
      const userRepo = uow.getCustomRepository(UserRepository);
      const user = new User();
      user.username = "username";
      user.password = "password";
      user.apiKey = "api-key";
      await userRepo.save(user);
    };
    await uow.withTransaction(work);

    const _user = await repo.findByUsername("username");
    expect(_user).not.toBeUndefined();

    await repo.delete({});
  });

  it("should rollback changes", async () => {
    const repo = connection.getCustomRepository(UserRepository);
    const uow = new TypeOrmUnitOfWork(connection);

    const work = async () => {
      const userRepo = uow.getCustomRepository(UserRepository);
      const user = new User();
      user.username = "username";
      user.password = "password";
      user.apiKey = "api-key";
      await userRepo.save(user);
      throw new Error("an error to force rollback");
    };
    try {
      await uow.withTransaction(work);
    } catch (error) {}

    const user = await repo.findByUsername("username");
    expect(user).toBeUndefined();
  });
});
