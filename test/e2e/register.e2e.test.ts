import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { loadDependencies } from "@loaders/index";
import { userRepositoryType } from "@loaders/typedi.constants";
import { getGw2ApiKey } from "../common/get-gw2-api-key";
import { Connection } from "typeorm";

describe("Register e2e tests", () => {
  const url = "/register";
  let app: any;
  let conn: Connection;
  let userRepo: IUserRepository;

  beforeAll(async () => {
    ({ app, conn } = await loadDependencies({ loadTasks: false }));

    userRepo = Container.get(userRepositoryType);
  });

  afterEach(async () => {
    await userRepo.delete({});
  });

  afterAll(async () => {
    await conn.close();
  });

  it("should create a user", async () => {
    const user = {
      username: "username",
      password: "password",
      apiKey: getGw2ApiKey(),
    };
    const userInDbBefore = await userRepo.findOne({
      where: { username: user.username },
    });

    await request(app).post(url).send(user);

    const userInDbAfter = await userRepo.findOne({
      where: { username: user.username },
    });
    expect(userInDbBefore).toBeUndefined();
    expect(userInDbAfter).toBeDefined();
  });
});
