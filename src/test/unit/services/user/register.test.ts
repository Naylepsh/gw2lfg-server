import { register } from "../../../../services/user/register";
import { createDummyUser } from "../../../helpers/user.helper";
import { simpleHash } from "./simple.hashing";
import { UserMemoryRepository } from "./user.memory-repository";

describe("User service: register tests", () => {
  it("should throw an error if username is taken", async () => {
    const user = createDummyUser();
    const userRepository = new UserMemoryRepository([user]);

    expect(register(user, userRepository, simpleHash)).rejects.toThrow();
  });

  it("should save an user if valid data was passed", async () => {
    const user = createDummyUser();
    const userRepository = new UserMemoryRepository();

    await register(user, userRepository, simpleHash);

    const userInDb = await userRepository.findByUsername("username");
    expect(userInDb).not.toBeUndefined();
  });

  it("should hash password if valid data was passed", async () => {
    const user = createDummyUser();
    const userRepository = new UserMemoryRepository();

    await register(user, userRepository, simpleHash);

    const userInDb = await userRepository.findByUsername(user.username);
    expect(userInDb!.password).not.toEqual(user.password);
  });
});
