import Container from "typedi";
import { checkApiKeyValidityServiceType } from "@loaders/typedi.constants";
import { IsValidApiKey } from "@api/controllers/users/validators/api-key.validator";
import { FakeApiKeyChecker } from "../../../../helpers/fake-api-key-checker";
import { validate } from "class-validator";

class ObjectWithApiKey {
  @IsValidApiKey()
  apiKey: string;
}

describe("ApiKeyValidator tests", () => {
  it("should throw an error if api key is not valid", async () => {
    const areAllKeysValid = false;
    const fakeChecker = new FakeApiKeyChecker(areAllKeysValid);
    Container.set(checkApiKeyValidityServiceType, fakeChecker);

    const invalidApiKey = "-1";
    const objectWithApiKey = new ObjectWithApiKey();
    objectWithApiKey.apiKey = invalidApiKey;

    const errors = await validate(objectWithApiKey);

    expect(errors.length).toBeGreaterThan(0);
    const apiKeyError = errors[0];
    // validator should state which property failed the validation
    expect(apiKeyError).toHaveProperty("property", "apiKey");
    // validator should state the reason why validation failed
    expect(apiKeyError).toHaveProperty("constraints");
  });

  it("should pass the check if api key is valid", async () => {
    const areAllKeysValid = true;
    const fakeChecker = new FakeApiKeyChecker(areAllKeysValid);
    Container.set(checkApiKeyValidityServiceType, fakeChecker);

    const validApiKey = "1";
    const objectWithApiKey = new ObjectWithApiKey();
    objectWithApiKey.apiKey = validApiKey;

    const errors = await validate(objectWithApiKey);

    expect(errors.length).toBe(0);
  });
});
