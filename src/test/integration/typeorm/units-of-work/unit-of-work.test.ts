import { Connection, getConnection } from "typeorm";
import { User } from "../../../../entities/user.entity";
import { loadTypeORM } from "../../../../loaders/typeorm";
import { TypeOrmUnitOfWork } from "../../../../repositories/raid-post.unit-of-work";
// import { TypeOrmUnitOfWork } from "../../../../repositories/raid-post.unit-of-work";
import { UserRepository } from "../../../../repositories/user.repository";

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

    await uow.start();
    const userRepo = uow.getRepository(UserRepository);
    const user = new User();
    user.username = "username";
    user.password = "password";
    user.apiKey = "api-key";

    await userRepo.save(user);
    await uow.commit();

    const _user = await repo.findByUsername("username");
    expect(_user).not.toBeUndefined();

    await repo.delete({});
  });

  it("should rollback changes", async () => {
    const repo = connection.getCustomRepository(UserRepository);
    const uow = new TypeOrmUnitOfWork(connection);

    await uow.start();
    const userRepo = uow.getRepository(UserRepository);
    const user = new User();
    user.username = "username";
    user.password = "password";
    user.apiKey = "api-key";

    await userRepo.save(user);
    await uow.rollback();

    const _user = await repo.findByUsername("username");
    expect(_user).toBeUndefined();
  });
});
