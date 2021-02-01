import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { loadDependencies } from "@loaders/index";
import { userRepositoryType } from "@loaders/typedi.constants";
import { getGw2ApiKey } from "../common/get-gw2-api-key";

describe("Register e2e tests", () => {
  const url = "/register";
  let app: any;
  let userRepo: IUserRepository;

  beforeEach(async () => {
    ({ app } = await loadDependencies());

    userRepo = Container.get(userRepositoryType);
  });

  afterEach(async () => {
    await userRepo.delete({});
  });

  it("should create a user", async () => {
    const user = {
      username: "username",
      password: "password",
      apiKey: getGw2ApiKey(),
    };
    const userInDbBefore = await userRepo.findByUsername(user.username);

    await request(app).post(url).send(user);

    const userInDbAfter = await userRepo.findByUsername(user.username);
    expect(userInDbBefore).toBeUndefined();
    expect(userInDbAfter).toBeDefined();
  });
});
