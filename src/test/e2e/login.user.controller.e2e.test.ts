import "reflect-metadata";
import request from "supertest";
import * as jwt from "jsonwebtoken";
import Container from "typedi";
import { IUserRepository } from "../../data/repositories/user/user.repository.interface";
import { loadDependencies } from "../../loaders";
import { userRepositoryType } from "../../loaders/typedi.constants";

describe("RegisterUserController e2e tests", () => {
  const registerUrl = "/register";
  const loginUrl = "/login";
  let app: any;
  let userRepo: IUserRepository;

  beforeEach(async () => {
    let container: typeof Container;
    ({ app, container } = await loadDependencies());

    userRepo = container.get(userRepositoryType);
  });

  afterEach(async () => {
    await userRepo.delete({});
  });

  it("should return a jwt", async () => {
    const user = {
      username: "username",
      password: "password",
      apiKey: "ap1-k3y",
    };

    await request(app).post(registerUrl).send(user);
    const { body: token } = await request(app)
      .post(loginUrl)
      .send({ username: user.username, password: user.password });

    const decoded = jwt.decode(token);

    expect(decoded).toHaveProperty("id");
  });
});
