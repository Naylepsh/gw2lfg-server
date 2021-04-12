import { Action } from "routing-controllers";
import { CurrentUserJWTMiddleware } from "@api/middleware/current-user.middleware";
import { createToken } from "@api/utils/token/jwt";
import { UserMemoryRepository } from "../../../common/repositories/user.memory-repository";
import { config } from "@root/config";
import { User } from "@data/entities/user/user.entity";
import { promisify } from "util";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";

const sleep = promisify(setTimeout);

describe("CurrentUser Middleware Unit Tests", () => {
  let repo: IUserRepository;
  let middleware: CurrentUserJWTMiddleware;

  beforeEach(() => {
    repo = new UserMemoryRepository();
    middleware = new CurrentUserJWTMiddleware(repo);
  });

  it("should return a user", async () => {
    const user = new User({ username: "u", password: "p", apiKey: "a" });
    await repo.save(user);
    const token = createToken(user.id);
    const action: Action = {
      request: { headers: { authorization: `Bearer ${token}` } },
      response: {},
    };

    const res = await middleware.getCurrentUser(action);

    expect(res).toHaveProperty("id", user.id);
    expect(res).toHaveProperty("username", user.username);
  });

  it("should return null if no token was passed", async () => {
    const action: Action = {
      request: { headers: { authorization: "" } },
      response: {},
    };

    const res = await middleware.getCurrentUser(action);

    expect(res).toBeNull();
  });

  it("should return null if invalid token was passed", async () => {
    const action: Action = {
      request: { headers: { authorization: "Bearer to.ke.n" } },
      response: {},
    };

    const res = await middleware.getCurrentUser(action);

    expect(res).toBeNull();
  });

  it("should return null if expired token was passed", async () => {
    config.server.jwt.options.expiresIn = "1"; // 1ms
    const token = createToken(1);
    const action: Action = {
      request: { headers: { authorization: `Bearer ${token}` } },
      response: {},
    };

    await sleep(100);

    const res = await middleware.getCurrentUser(action);

    expect(res).toBeNull();
  });

  it("should return null if no user was attached to token", async () => {
    const token = createToken(1);
    const action: Action = {
      request: { headers: { authorization: `Bearer ${token}` } },
      response: {},
    };

    const res = await middleware.getCurrentUser(action);

    expect(res).toBeNull();
  });
});
