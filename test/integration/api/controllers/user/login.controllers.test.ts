import "reflect-metadata";
import * as jwt from "jsonwebtoken";
import { createExpressServer, useContainer } from "routing-controllers";
import request from "supertest";
import Container from "typedi";
import { LoginUserController } from "@root/api/controllers/users/login.controller";
import { User } from "@root/data/entities/user/user.entity";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { LoginService } from "@root/services/user/login.service";
import { RegisterService } from "@root/services/user/register.service";
import { UserMemoryRepository } from "../../../../common/repositories/user.memory-repository";

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

  it("should return a token if valid user data was passed", async () => {
    const validUserData = {
      username: "existingUser",
      password: "password",
    };

    const result = await request(app).post(url).send(validUserData);

    const token = result.body.data.token;
    const decoded = jwt.decode(token);

    expect(decoded).toHaveProperty("id");
  });
});
