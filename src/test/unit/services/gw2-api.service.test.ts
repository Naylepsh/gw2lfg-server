import {
  getItem,
  getItemFromMultipleSources,
} from "../../../services/gw2-api/gw2-api.service";
import { Item } from "../../../services/gw2-items/item.interface";

const storage = (itemStorage: Item[]) => {
  return (_: string): Promise<Item[]> =>
    new Promise((resolve) => resolve(itemStorage));
};

const createItemFetcher = (items: Item[]) => {
  const itemsFetcher = storage(items);
  return getItem(itemsFetcher);
};

const createFetchersForItemGroups = (itemGroups: Item[][]) => {
  return itemGroups.map(createItemFetcher);
};

describe("test gw2 api service", () => {
  describe("get item from single source", () => {
    it("should return item with zero quantity if it was not found", async () => {
      const id = "1";
      const apiKey = "AP1-K3Y";
      const fetchItems = storage([]);

      const item = await getItem(fetchItems)(id, apiKey);

      expect(item.count).toBe(0);
    });

    it("should sum all occurernces of an item in the source", async () => {
      const id = "1";
      const apiKey = "AP1-K3Y";
      const items = [
        { id, count: 1 },
        { id, count: 3 },
        { id: "2", count: 10 },
      ];
      const fetchItems = storage(items);

      const item = await getItem(fetchItems)(id, apiKey);

      expect(item.count).toBe(4);
    });
  });

  describe("get item from multiple sources", () => {
    it("should sum all occurrences of an item in all the sources", async () => {
      const id = "1";
      const apiKey = "AP1-K3Y";
      const fetchers = createFetchersForItemGroups([
        [],
        [{ id, count: 5 }],
        [
          { id, count: 3 },
          { id, count: 2 },
        ],
      ]);

      const item = await getItemFromMultipleSources(fetchers)(id, apiKey);

      expect(item.count).toBe(10);
    });
  });
});
