import "reflect-metadata";
import request from "supertest";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import Container from "typedi";
import { User } from "../../../../data/entities/user.entity";
import { IUserRepository } from "../../../../data/repositories/user/user.repository.interface";
import { RegisterService } from "../../../../services/user/register";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";
import { CurrentUserJWTMiddleware } from "../../../../api/middleware/current-user.middleware";
import { CreateJwtService } from "../../../../api/services/token/create";
import { MeController } from "../../../../api/controllers/user/me.controller";

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
    token = new CreateJwtService().createToken(user.id);

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
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    expect(result.status).toBe(200);
  });

  it("should return user data (without confidential data) if user is logged in", async () => {
    const { body } = await request(app)
      .get(url)
      .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

    expect(body).toHaveProperty("id", user.id);
    expect(body).toHaveProperty("username", user.username);
    expect(body).not.toHaveProperty("password");
  });
});
