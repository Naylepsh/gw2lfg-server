import "reflect-metadata";
import request from "supertest";
import { Container } from "typedi";
import * as jwt from "jsonwebtoken";
import { RegisterUserController } from "@root/api/controllers/users/register.controller";
import { User } from "@root/data/entities/user/user.entity";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { RegisterService } from "@root/services/user/register.service";
import { checkApiKeyValidityServiceType } from "@loaders/typedi.constants";
import { UserMemoryRepository } from "../../../common/repositories/user.memory-repository";
import { createExpressServer, useContainer } from "routing-controllers";
import { FakeApiKeyChecker } from "../../../common/fake-api-key-checker";

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

    const areAllApiKeysValid = true;
    const apiKeyValidityChecker = new FakeApiKeyChecker(areAllApiKeysValid);
    Container.set(checkApiKeyValidityServiceType, apiKeyValidityChecker);

    useContainer(Container);

    app = createExpressServer({
      controllers: [RegisterUserController],
    });
  });

  it("should return 400 if request contains invalid data", async () => {
    // excluded properties: username, password, apiKey
    const invalidUserData = {};

    const { status } = await request(app).post(url).send(invalidUserData);

    expect(status).toBe(400);
  });

  it("should provide an error message for each of the missing properties if request is missing data", async () => {
    // excluded properties: username, password, apiKey
    const numberOfMissingProperties = 3;
    const invalidUserData = {};

    const { body } = await request(app).post(url).send(invalidUserData);

    expect(body).toHaveProperty("errors");
    expect(body.errors.length).toBe(numberOfMissingProperties);
  });

  it("should return 409 if user already exists", async () => {
    const validUserData = {
      username: "existingUser",
      password: "password",
      apiKey: "some-api-key",
    };

    const { status } = await request(app).post(url).send(validUserData);

    expect(status).toBe(409);
  });

  it("should return 201 if valid data was passed", async () => {
    const validUserData = {
      username: "newUser",
      password: "password",
      apiKey: "api-key",
    };

    const { status } = await request(app).post(url).send(validUserData);

    expect(status).toBe(201);
  });

  it("should return a token if valid data was passed", async () => {
    const validUserData = {
      username: "newUser",
      password: "password",
      apiKey: "api-key",
    };

    const { body } = await request(app).post(url).send(validUserData);
    const token = body.data.token;
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
