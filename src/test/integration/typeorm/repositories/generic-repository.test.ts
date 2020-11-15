import { Connection } from "typeorm";
import { User } from "../../../../entities/user.entity";
import { loadTypeORM } from "../../../../loaders/typeorm";
import { UserRepository } from "../../../../repositories/user.repository";

/*
  It's not possible to call GenericRepository by itself, 
  hence why testing on UserRepository which inherits from GenericRepository
*/
describe("Generic Repository Tests", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await loadTypeORM();
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
    await connection.getRepository(User).insert(users);
  }
});
