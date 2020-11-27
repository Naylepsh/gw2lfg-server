import { Connection } from "typeorm";
import { User } from "../../../../core/entities/user.entity";
import { loadTypeORM } from "../../../../api/loaders/typeorm";
import { UserRepository } from "../../../../data/repositories/user.repository";

/*
  It's not possible to call GenericRepository by itself, 
  hence why testing on UserRepository which inherits from GenericRepository
*/
describe("Generic Repository Tests", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await loadTypeORM();
  });

  afterEach(async () => {
    await connection.getRepository(User).delete({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should take only one item", async () => {
    const repo = connection.getCustomRepository(UserRepository);
    await seedDbWithUsers();

    const res = await repo.findMany({ take: 1 });

    expect(res.length).toBe(1);
  });

  async function seedDbWithUsers() {
    const users = Array.from(Array(5).keys()).map(
      (i) =>
        new User({
          username: `username${i}`,
          password: "password",
          apiKey: "api-key",
        })
    );
    await connection.getRepository(User).save(users);
  }
});
