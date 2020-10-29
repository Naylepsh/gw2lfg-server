import assert from "assert";
import "../../../../config";
import { fetchItemsFromBank } from "../../../../services/gw2-api/gw2-api.proxy";

describe("GW2 API proxy test", () => {
  let apiKey: string;

  beforeAll(() => {
    assert(typeof process.env.GW2API_TOKEN !== "undefined");
    apiKey = process.env.GW2API_TOKEN;
  });

  describe("get item from bank", () => {
    it("should return items when pass valid api key", async () => {
      const item = await fetchItemsFromBank(apiKey);

      expect(item.length).toBeGreaterThanOrEqual(0);
    });

    it("should throw an error when invalid api key was passed", async () => {
      const invalidApiKey = "invalid-key";

      expect(fetchItemsFromBank(invalidApiKey)).rejects.toThrow();
    });
  });
});
