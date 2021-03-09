import { validate } from "class-validator";
import { IsIdArray } from "@api/controllers/raid-posts/validators/id-array.validator";

class ObjectWithIdArray {
  @IsIdArray()
  ids: string;

  constructor(ids: string) {
    this.ids = ids;
  }
}

describe("ApiKeyValidator tests", () => {
  it("should throw an error if string-turned-array contains objects other than id", async () => {
    const invalidIds = "1,2,a";
    const objectWithInvalidIdArray = new ObjectWithIdArray(invalidIds);

    const errors = await validate(objectWithInvalidIdArray);

    expect(errors.length).toBeGreaterThan(0);
    const apiKeyError = errors[0];
    // validator should state which property failed the validation
    expect(apiKeyError).toHaveProperty("property", "ids");
    // validator should state the reason why validation failed
    expect(apiKeyError).toHaveProperty("constraints");
  });

  it("should pass the check if string-turned-array contains ids only", async () => {
    const validIds = "1,2,3";
    const objectWithValidApiKey = new ObjectWithIdArray(validIds);

    const errors = await validate(objectWithValidApiKey);

    expect(errors.length).toBe(0);
  });
});
