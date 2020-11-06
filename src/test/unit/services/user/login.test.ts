import { login } from "../../../../services/user/login";
import { register } from "../../../../services/user/register";
import { createDummyUser } from "../../../helpers/user.helper";
import { simpleCompare, simpleHash } from "./simple.hashing";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";

describe("User service: login tests", () => {
  it("should throw an error if user does not exist", async () => {
    const user = createDummyUser();
    const userRepository = new UserMemoryRepository();

    expect(login(user, userRepository, simpleCompare)).rejects.toThrow();
  });

  it("should throw an error if password does not match", async () => {
    const user = createDummyUser();
    const userRepository = new UserMemoryRepository();
    await register(user, userRepository, simpleHash);
    const loginDto = { username: user.username, password: "invalid password" };

    expect(login(loginDto, userRepository, simpleCompare)).rejects.toThrow();
  });

  it("should return an user if valid auth data was passed", async () => {
    const user = createDummyUser();
    const userRepository = new UserMemoryRepository();
    await register(user, userRepository, simpleHash);
    const loginDto = { username: user.username, password: user.password };

    const loggedInUser = await login(loginDto, userRepository, simpleCompare);

    expect(loggedInUser).toHaveProperty("username", user.username);
  });
});
