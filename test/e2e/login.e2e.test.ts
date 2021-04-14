import "reflect-metadata";
import request from "supertest";
import * as jwt from "jsonwebtoken";
import Container from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { loadDependencies } from "@loaders/index";
import { userRepositoryType } from "@loaders/typedi.constants";
import { seedUser } from "./seeders";
import { Connection } from "typeorm";

describe("Login e2e tests", () => {
  const url = "/login";
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

  it("should return a jwt", async () => {
    const { user } = await seedUser(app);

    const response = await request(app)
      .post(url)
      .send({ username: user.username, password: user.password });
    const token = response.body.data.token;
    const decoded = jwt.decode(token);

    expect(decoded).toHaveProperty("id");
  });
});
