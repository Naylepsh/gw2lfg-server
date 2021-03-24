import "reflect-metadata";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import request from "supertest";
import Container from "typedi";
import { MeController } from "@root/api/controllers/users/me.controller";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { createToken } from "@root/api/utils/token/create";
import { User } from "@root/data/entities/user/user.entity";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { RegisterService } from "@root/services/user/register.service";
import { UserMemoryRepository } from "../../../common/repositories/user.memory-repository";
import { AUTH_HEADER, toBearerToken } from "../../../common/to-bearer-token";

describe("MeController integration tests", () => {
  const url = "/me";
  let userRepo: IUserRepository;
  let app: any;
  let user: User;
  let token: string;

  beforeEach(async () => {
    const _user = new User({
      username: "existingUser",
      password: "password",
      apiKey: "api-key",
    });
    userRepo = new UserMemoryRepository();
    const registerService = new RegisterService(userRepo);
    user = await registerService.register(_user);
    token = createToken(user.id);

    const controller = new MeController();

    Container.set(MeController, controller);
    useContainer(Container);

    const currentUserMiddleware = new CurrentUserJWTMiddleware(userRepo);

    app = createExpressServer({
      controllers: [MeController],
      currentUserChecker: async (action: Action) =>
        await currentUserMiddleware.getCurrentUser(action),
    });
  });

  it("should return 401 if user is not logged in", async () => {
    const result = await request(app).get(url);

    expect(result.status).toBe(401);
  });

  it("should return 200 if user is logged in", async () => {
    const result = await request(app)
      .get(url)
      .set(AUTH_HEADER, toBearerToken(token));

    expect(result.status).toBe(200);
  });

  it("should return user data (without confidential data) if user is logged in", async () => {
    const { body } = await request(app)
      .get(url)
      .set(AUTH_HEADER, toBearerToken(token));
    const data = body.data;

    expect(data).toHaveProperty("id", user.id);
    expect(data).toHaveProperty("username", user.username);
    expect(data).not.toHaveProperty("password");
  });
});
