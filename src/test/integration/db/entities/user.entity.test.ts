import { Connection, getConnection, Repository } from "typeorm";
import { User } from "../../../../entities/user.entity";
import { loadTypeORM } from "../../../../loaders/typeorm";

interface IUser {
  apiKey: string;
  username: string;
  password: string;
}

describe("TypeORM User Entity Tests", () => {
  let repository: Repository<User>;
  let connection: Connection;

  beforeAll(async () => {
    connection = await loadTypeORM();
    repository = connection.getRepository(User);
  });

  afterEach(async () => {
    await repository.delete({});
  });

  afterAll(async () => {
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
    await repository.save(user);

    const userInDb = await repository.findOne(user.id);

    expect(userInDb).not.toBeNull();
    expectUserToHavePropertiesOfOtherUser(userInDb!, user);
  });
});

const createUser = (
  apiKey = "AP1-K3Y",
  username = "username",
  password = "password"
) => {
  const user = new User(username, password, apiKey);

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
