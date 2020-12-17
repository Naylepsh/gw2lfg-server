import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { IUserRepository } from "../../data/repositories/user/user.repository.interface";
import { loadDependencies } from "../../loaders";
import { userRepositoryType } from "../../loaders/typedi.constants";
import { seedUser } from "./seeders";
import { CurrentUserJWTMiddleware } from "../../api/middleware/current-user.middleware";

describe("Me e2e tests", () => {
  const loginUrl = "/login";
  const meUrl = "/me";
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

  it("should return logged in user data", async () => {
    const user = await seedUser(app);

    const { body: token } = await request(app)
      .post(loginUrl)
      .send({ username: user.username, password: user.password });

    const { body } = await request(app)
      .get(meUrl)
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("username", user.username);
  });
});
