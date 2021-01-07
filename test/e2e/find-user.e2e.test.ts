import "reflect-metadata";
import request from "supertest";
import Container from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { loadDependencies } from "@loaders/index";
import { userRepositoryType } from "@loaders/typedi.constants";
import { seedUser } from "./seeders";

describe("Login e2e tests", () => {
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

  it("return a user with their gw2 account", async () => {
    const { user } = await seedUser(app);

    const { body } = await request(app).get(toUrl(user.id));

    expect(body.data).toHaveProperty("user");
    expect(body.data).toHaveProperty("account");
  });

  const toUrl = (id: number) => {
    return `/users/${id}`;
  };
});