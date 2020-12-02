import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { createExpressServer, useContainer } from "routing-controllers";
import { LoginUserController } from "../../../../api/controllers/user/login.controller";
import { User } from "../../../../data/entities/user.entity";
import { IUserRepository } from "../../../../data/repositories/user/user.repository.interface";
import { LoginService } from "../../../../services/user/login";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";
import { RegisterService } from "../../../../services/user/register";

describe("LoginUserController integration tests", () => {
  const url = "/login";
  let userRepo: IUserRepository;
  let app: any;

  beforeEach(async () => {
    const user = new User({
      username: "existingUser",
      password: "password",
      apiKey: "api-key",
    });
    userRepo = new UserMemoryRepository();
    const registerService = new RegisterService(userRepo);
    await registerService.register(user);
    const loginService = new LoginService(userRepo);
    const controller = new LoginUserController(loginService);

    Container.set(LoginUserController, controller);
    useContainer(Container);

    app = createExpressServer({
      controllers: [LoginUserController],
    });
  });

  it("should return 400 if username is missing", async () => {
    const invalidUserData = {
      password: "password",
    };

    const result = await request(app).post(url).send(invalidUserData);

    expect(result.status).toBe(400);
  });

  it("should return 400 if password is missing", async () => {
    const invalidUserData = {
      username: "username",
    };

    const result = await request(app).post(url).send(invalidUserData);

    expect(result.status).toBe(400);
  });

  it("should return 401 if username does not match", async () => {
    const invalidUserData = {
      username: "newUsername",
      password: "password",
    };

    const result = await request(app).post(url).send(invalidUserData);

    expect(result.status).toBe(401);
  });

  it("should return 401 if password does not match", async () => {
    const invalidUserData = {
      username: "existingUser",
      password: "differentPassword",
    };

    const result = await request(app).post(url).send(invalidUserData);

    expect(result.status).toBe(401);
  });

  it("should return 200 if valid user data was passed", async () => {
    const validUserData = {
      username: "existingUser",
      password: "password",
    };

    const result = await request(app).post(url).send(validUserData);

    expect(result.status).toBe(200);
  });
});