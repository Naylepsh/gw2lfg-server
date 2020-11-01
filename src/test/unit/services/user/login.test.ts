import { User } from "../../../../entities/user.entity";
import { login } from "../../../../services/user/login";
import { register } from "../../../../services/user/register";
import { simpleCompare, simpleHash } from "./simple.hashing";
import { UserMemoryRepository } from "./user.memory-repository";

describe("User service: login tests", () => {
  it("should throw an error if user does not exist", async () => {
    const user = new User("username", "password", "api-key");
    const userRepository = new UserMemoryRepository();

    expect(login(user, userRepository, simpleCompare)).rejects.toThrow();
  });

  it("should throw an error if password does not match", async () => {
    const user = new User("username", "password", "api-key");
    const userRepository = new UserMemoryRepository();
    await register(user, userRepository, simpleHash);
    const loginDto = { username: user.username, password: "invalid password" };

    expect(login(loginDto, userRepository, simpleCompare)).rejects.toThrow();
  });

  it("should return an user if valid auth data was passed", async () => {
    const user = new User("username", "password", "api-key");
    const userRepository = new UserMemoryRepository();
    await register(user, userRepository, simpleHash);
    const loginDto = { username: user.username, password: user.password };

    const loggedInUser = await login(loginDto, userRepository, simpleCompare);

    expect(loggedInUser).toHaveProperty("username", user.username);
  });
});
