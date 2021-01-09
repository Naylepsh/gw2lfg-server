import "@root/config";
import { CheckApiKeyValidityService } from "@services/gw2-api/api-key/api-key-check.gw2-api.service";
import { getGw2ApiKey } from "../../../../helpers/get-gw2-api-key";

describe("GW2 api key validity check test", () => {
  const timeLimit = 20000;

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
      const apiKey = getGw2ApiKey();
      const apiKeyChecker = new CheckApiKeyValidityService();

      const isValid = await apiKeyChecker.isValid(apiKey);

      expect(isValid).toBe(true);
    },
    timeLimit
  );
});
