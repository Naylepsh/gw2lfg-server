import { getConnection } from "typeorm";
import { User } from "../../../../db/typeorm/entities/user.entity.typeorm";
import { UserRepository } from "../../../../db/typeorm/repositories/user.repository.typeorm";
import { loadTypeORM } from "../../../../loaders/typeorm";

interface IUser {
  apiKey: string;
  username: string;
  password: string;
}

describe("TypeORM User Repository Tests", () => {
  const repository = new UserRepository();

  beforeAll(async () => {
    await loadTypeORM();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection
      .createQueryBuilder()
      .delete()
      .from(User, "user")
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
      .from(User, "user")
      .where({ username: user.username })
      .execute();
    const userInDb = rows[0];
    expect(userInDb).not.toBeNull();
    expectUserToHavePropertiesOfOtherUser(userInDb as IUser, user);
  });

  it("should retrieve an user", async () => {
    const user = createUser();
    const { id } = await repository.save(user);

    const userInDb = await repository.findById(id);

    expect(userInDb).not.toBeNull();
    expectUserToHavePropertiesOfOtherUser(userInDb!, user);
  });
});

const createUser = (
  apiKey = "AP1-K3Y",
  username = "username",
  password = "password"
) => {
  const user = new User();
  user.apiKey = apiKey;
  user.username = username;
  user.password = password;

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
