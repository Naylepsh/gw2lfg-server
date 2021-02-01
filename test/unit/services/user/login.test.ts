import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { LoginService } from "@root/services/user/login.service";
import { RegisterService } from "@root/services/user/register.service";
import { UserMemoryRepository } from "../../../common/repositories/user.memory-repository";
import { createDummyUser } from "../../../common/user.helper";

describe("User service: login tests", () => {
  let userRepository: IUserRepository;
  let loginService: LoginService;
  let registerService: RegisterService;

  beforeEach(() => {
    userRepository = new UserMemoryRepository();
    loginService = new LoginService(userRepository);
    registerService = new RegisterService(userRepository);
  });

  it("should throw an error if user does not exist", async () => {
    const user = createDummyUser();

    expect(loginService.login(user)).rejects.toThrow();
  });

  it("should throw an error if password does not match", async () => {
    const user = createDummyUser();
    await registerService.register(user);
    const loginDto = { username: user.username, password: "invalid password" };

    expect(loginService.login(loginDto)).rejects.toThrow();
  });

  it("should return an user if valid auth data was passed", async () => {
    const user = createDummyUser();
    await registerService.register(user);
    const loginDto = { username: user.username, password: user.password };

    const loggedInUser = await loginService.login(loginDto);

    expect(loggedInUser).toHaveProperty("username", user.username);
  });
});
