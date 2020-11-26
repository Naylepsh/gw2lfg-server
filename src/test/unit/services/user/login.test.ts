import { LoginService } from "../../../../services/user/login";
import { RegisterService } from "../../../../services/user/register";
import { createDummyUser } from "../../../helpers/user.helper";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";
import { IUserRepository } from "../../../../repositories/user.repository";

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
