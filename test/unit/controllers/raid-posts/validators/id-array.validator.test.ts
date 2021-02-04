import { validate } from "class-validator";
import { IsIdArray } from "@api/controllers/raid-posts/validators/id-array.validator";

class ObjectWithIdArray {
  @IsIdArray()
  ids: string;
}

describe("ApiKeyValidator tests", () => {
  it("should throw an error if string-turned-array contains objects other than id", async () => {
    const invalidIdArray = "1,2,a";
    const objectWithIdArray = new ObjectWithIdArray();
    objectWithIdArray.ids = invalidIdArray;

    const errors = await validate(objectWithIdArray);

    expect(errors.length).toBeGreaterThan(0);
    const apiKeyError = errors[0];
    // validator should state which property failed the validation
    expect(apiKeyError).toHaveProperty("property", "ids");
    // validator should state the reason why validation failed
    expect(apiKeyError).toHaveProperty("constraints");
  });

  it("should pass the check if string-turned-array contains ids only", async () => {
    const validIdArray = "1,2,3";
    const objectWithApiKey = new ObjectWithIdArray();
    objectWithApiKey.ids = validIdArray;

    const errors = await validate(objectWithApiKey);

    expect(errors.length).toBe(0);
  });
});
