import assert from "assert";
import "@root/config";
import { CheckApiKeyValidityService } from "@services/gw2-api/api-key/api-key-check.gw2-api.service";

describe("GW2 api key validity check test", () => {
  const timeLimit = 10000;

  it(
    "should return false when given api is invalid",
    async () => {
      const invalidKey = "-1";
      const apiKeyChecker = new CheckApiKeyValidityService();

      const isValid = await apiKeyChecker.isValid(invalidKey);

      expect(isValid).toBe(false);
    },
    timeLimit
  );

  it(
    "should return true when given api is valid",
    async () => {
      assert(typeof process.env.GW2API_TOKEN !== "undefined");
      const apiKey = process.env.GW2API_TOKEN;
      const apiKeyChecker = new CheckApiKeyValidityService();

      const isValid = await apiKeyChecker.isValid(apiKey);

      expect(isValid).toBe(true);
    },
    timeLimit
  );
});
