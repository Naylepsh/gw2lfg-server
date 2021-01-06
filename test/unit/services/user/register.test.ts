import { RegisterService } from "@root/services/user/register.service";
import { createDummyUser } from "../../../helpers/user.helper";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";

describe("User service: register tests", () => {
  it("should throw an error if username is taken", async () => {
    const user = createDummyUser();
    const userRepository = new UserMemoryRepository([user]);
    const service = new RegisterService(userRepository);

    expect(service.register(user)).rejects.toThrow();
  });

  it("should save an user if valid data was passed", async () => {
    const user = createDummyUser();
    const userRepository = new UserMemoryRepository();
    const service = new RegisterService(userRepository);

    await service.register(user);

    const userInDb = await userRepository.findByUsername("username");
    expect(userInDb).not.toBeUndefined();
  });

  it("should hash password if valid data was passed", async () => {
    const user = createDummyUser();
    const userRepository = new UserMemoryRepository();
    const service = new RegisterService(userRepository);

    await service.register(user);

    const userInDb = await userRepository.findByUsername(user.username);
    expect(userInDb!.password).not.toEqual(user.password);
  });
});
