import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { loadDependencies } from "@loaders/index";
import { userRepositoryType } from "@loaders/typedi.constants";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { seedUser } from "./seeders";

describe("Me e2e tests", () => {
  const loginUrl = "/login";
  const meUrl = "/me";
  const timeLimit = 15000;
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

  it(
    "should return logged in user data",
    async () => {
      const { user } = await seedUser(app);

      const loginResponse = await request(app)
        .post(loginUrl)
        .send({ username: user.username, password: user.password });
      const token = loginResponse.body.data.token;

      const { body } = await request(app)
        .get(meUrl)
        .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);
      const data = body.data;

      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("username", user.username);
    },
    timeLimit
  );
});
