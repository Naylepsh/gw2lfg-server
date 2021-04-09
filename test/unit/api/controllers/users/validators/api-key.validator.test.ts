import Container from "typedi";
import { checkApiKeyValidityServiceType } from "@loaders/typedi.constants";
import { IsValidApiKey } from "@api/controllers/users/validators/api-key.validator";
import { FakeApiKeyChecker } from "../../../../../common/fake-api-key-checker";
import { validate } from "class-validator";

class ObjectWithApiKey {
  @IsValidApiKey()
  apiKey: string = "123-456";
}

describe("ApiKeyValidator tests", () => {
  it("should throw an error if api key is not valid", async () => {
    setAreAllKeysValid(false);
    const objectWithApiKey = new ObjectWithApiKey();

    const errors = await validate(objectWithApiKey);

    expect(errors.length).toBeGreaterThan(0);
    const apiKeyError = errors[0];
    // validator should state which property failed the validation
    expect(apiKeyError).toHaveProperty("property", "apiKey");
    // validator should state the reason why validation failed
    expect(apiKeyError).toHaveProperty("constraints");
  });

  it("should pass the check if api key is valid", async () => {
    setAreAllKeysValid(true);
    const objectWithApiKey = new ObjectWithApiKey();

    const errors = await validate(objectWithApiKey);

    expect(errors.length).toBe(0);
  });

  function setAreAllKeysValid(areAllKeysValid: boolean) {
    const fakeChecker = new FakeApiKeyChecker(areAllKeysValid);
    Container.set(checkApiKeyValidityServiceType, fakeChecker);
  }
});
