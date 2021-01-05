import "reflect-metadata";
import request from "supertest";
import { Container } from "typedi";
import * as jwt from "jsonwebtoken";
import { RegisterUserController } from "@root/api/controllers/users/register.controller";
import { User } from "@root/data/entities/user/user.entity";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { RegisterService } from "@services/user/register";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";
import { createExpressServer, useContainer } from "routing-controllers";

describe("RegisterUserController integration tests", () => {
  const url = "/register";
  let userRepo: IUserRepository;
  let app: any;

  beforeEach(async () => {
    const user = new User({
      username: "existingUser",
      password: "password",
      apiKey: "api-key",
    });
    userRepo = new UserMemoryRepository([user]);
    const registerService = new RegisterService(userRepo);
    const controller = new RegisterUserController(registerService);

    Container.set(RegisterUserController, controller);
    useContainer(Container);

    app = createExpressServer({
      controllers: [RegisterUserController],
    });
  });

  it("should return 400 if request is missing user data", async () => {
    const invalidUserData = {
      username: "newUser",
    };

    const result = await request(app).post(url).send(invalidUserData);

    expect(result.status).toBe(400);
  });

  it("should return 422 if user already exists", async () => {
    const validUserData = {
      username: "existingUser",
      password: "password",
      apiKey: "some-api-key",
    };

    const result = await request(app).post(url).send(validUserData);

    expect(result.status).toBe(422);
  });

  it("should return 201 if valid data was passed", async () => {
    const validUserData = {
      username: "newUser",
      password: "password",
      apiKey: "api-key",
    };

    const result = await request(app).post(url).send(validUserData);

    expect(result.status).toBe(201);
  });

  it("should return a token if valid data was passed", async () => {
    const validUserData = {
      username: "newUser",
      password: "password",
      apiKey: "api-key",
    };

    const result = await request(app).post(url).send(validUserData);
    const token = result.body.data.token;
    const decoded = jwt.decode(token);

    expect(decoded).toHaveProperty("id");
  });

  it("should create a user if valid data was passed", async () => {
    const validUserData = {
      username: "newUser",
      password: "password",
      apiKey: "api-key",
    };

    await request(app).post(url).send(validUserData);

    const user = await userRepo.findByUsername(validUserData.username);
    expect(user).toBeDefined();
  });
});
