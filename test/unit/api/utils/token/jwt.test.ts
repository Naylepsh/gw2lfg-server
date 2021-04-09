import { createToken, Jwt } from "@api/utils/token/jwt";
import { config } from "@root/config";
import { promisify } from "util";

const sleep = promisify(setTimeout);

describe("JWT unit tests", () => {
  it("should save id", () => {
    const id = 1;
    const tokenString = createToken(id);
    const jwt = Jwt.fromString(tokenString);

    expect(jwt.id).toBe(id);
  });

  it("should return true if token has expired", async () => {
    config.server.jwt.options.expiresIn = "1"; // 1ms

    const id = 1;
    const tokenString = createToken(id);
    const jwt = Jwt.fromString(tokenString);
    await sleep(100);

    expect(jwt.hasExpired()).toBe(true);
  });

  it("should return false if token has not expired", async () => {
    config.server.jwt.options.expiresIn = "1d"; // 1 day

    const id = 1;
    const tokenString = createToken(id);
    const jwt = Jwt.fromString(tokenString);
    await sleep(100);

    expect(jwt.hasExpired()).toBe(false);
  });
});
