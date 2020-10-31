import { getConnection } from "typeorm";
import { User as PersistenceUser } from "../../../../db/typeorm/entities/user.entity";
import { UserRepository } from "../../../../db/typeorm/repositories/user.repository";
import { loadTypeORM } from "../../../../loaders/typeorm";
import { User as DomainUser } from "../../../../models/user.model";

interface IUser {
  apiKey: string;
  username: string;
  password: string;
}

describe("TypeORM User Repository Tests", () => {
  let repository: UserRepository;

  beforeAll(async () => {
    await loadTypeORM();
    repository = new UserRepository();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection
      .createQueryBuilder()
      .delete()
      .from(PersistenceUser, "user")
      .where({})
      .execute();
    connection.close();
  });

  it("should create an user in database", async () => {
    const user = createUser();

    await repository.save(user);

    const rows = await getConnection()
      .createQueryBuilder()
      .select()
      .from(PersistenceUser, "user")
      .where({ username: user.username })
      .execute();
    const userInDb = rows[0];
    expect(userInDb).not.toBeNull();
    expectUserToHavePropertiesOfOtherUser(userInDb as IUser, user);
  });

  it("should retrieve an user", async () => {
    const user = createUser();
    const { id } = await repository.save(createUser());

    const userInDb = await repository.findById(id);

    expect(userInDb).not.toBeNull();
    expectUserToHavePropertiesOfOtherUser(userInDb!, user);
  });
});

const createUser = (
  id = 1,
  apiKey = "AP1-K3Y",
  username = "username",
  password = "password"
) => {
  const user = new DomainUser(id, username, password, apiKey);

  return user;
};

const expectUserToHavePropertiesOfOtherUser = (
  user: IUser,
  otherUser: IUser
) => {
  expect(user).toHaveProperty("apiKey", otherUser.apiKey);
  expect(user).toHaveProperty("username", otherUser.username);
  expect(user).toHaveProperty("password", otherUser.password);
};
