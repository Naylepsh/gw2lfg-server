import "reflect-metadata";
import request from "supertest";
import * as jwt from "jsonwebtoken";
import Container from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { loadDependencies } from "@loaders/index";
import { userRepositoryType } from "@loaders/typedi.constants";
import { seedUser } from "./seeders";

describe("Login e2e tests", () => {
  const url = "/login";
  let app: any;
  let userRepo: IUserRepository;

  beforeEach(async () => {
    ({ app } = await loadDependencies());

    userRepo = Container.get(userRepositoryType);
  });

  afterEach(async () => {
    await userRepo.delete({});
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
