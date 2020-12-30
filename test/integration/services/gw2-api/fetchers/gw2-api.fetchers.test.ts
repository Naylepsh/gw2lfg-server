import assert from "assert";
import "@root/config";
import { fetchItemsFromCharacter } from "@root/services/gw2-api/fetchers/fetch-items-from-character";
import { fetchCharacters } from "@root/services/gw2-api/fetchers/fetch-characters";
import { fetchItemsFromBank } from "@root/services/gw2-api/fetchers/fetch-items-from-bank";

const getSomeCharacterName = async (apiKey: string) => {
  const characters = await fetchCharacters(apiKey);
  assert(characters.length > 0);

  return characters[0];
};

describe("GW2 API proxy test", () => {
  let apiKey: string;
  const timeLimit = 10000;

  beforeAll(() => {
    assert(typeof process.env.GW2API_TOKEN !== "undefined");
    apiKey = process.env.GW2API_TOKEN;
  });

  describe("fetch items from bank", () => {
    it(
      "should return items when valid api key was passed",
      async () => {
        const items = await fetchItemsFromBank(apiKey);

        expect(items.length).toBeGreaterThanOrEqual(0);
      },
      timeLimit
    );

    it(
      "should throw an error when invalid api key was passed",
      async () => {
        const invalidApiKey = "invalid-key";

        expect(fetchItemsFromBank(invalidApiKey)).rejects.toThrow();
      },
      timeLimit
    );
  });

  describe("fetch item from character", () => {
    it(
      "should return items from a character when a valid api key was passed",
      async () => {
        const name = await getSomeCharacterName(apiKey);
        const items = await fetchItemsFromCharacter(name, apiKey);

        expect(items.length).toBeGreaterThanOrEqual(0);
      },
      timeLimit
    );

    it(
      "should throw an error when a character does not exist",
      async () => {
        // characters names cannot include numbers
        const charName = "-1";

        expect(fetchItemsFromCharacter(charName, apiKey)).rejects.toThrow();
      },
      timeLimit
    );

    it(
      "should throw an error when invalid api key was passed",
      async () => {
        const name = await getSomeCharacterName(apiKey);
        const invalidApiKey = "invalid-key";

        expect(fetchItemsFromCharacter(name, invalidApiKey)).rejects.toThrow();
      },
      timeLimit
    );
  });
});
