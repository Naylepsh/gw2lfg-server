import {
  GetItemsFromMultipleSources
} from "@root/services/gw2-api/items/get-items-from-multiple-sources.fetcher";
import { GetItems } from "@root/services/gw2-api/items/get-items.fetcher";
import { GW2ApiItem } from "@services/gw2-items/item.interface";
import { storage, createFetchersForItemGroups } from "./item-storage";

describe("test gw2 api service", () => {
  describe("get item from single source", () => {
    it("should return item with zero quantity if it was not found", async () => {
      const id = 1;
      const apiKey = "AP1-K3Y";
      const fetchItems = storage();

      const item = await new GetItems(fetchItems).fetch([id], apiKey);

      expect(item.length).toBe(1);
      expect(item[0].count).toBe(0);
    });

    it("should sum all occurernces of an item in the source", async () => {
      const id = 1;
      const apiKey = "AP1-K3Y";
      const items = [
        { id, count: 1 },
        { id, count: 3 },
        { id: 2, count: 10 },
      ];
      const fetchItems = storage(
        new Map<string, GW2ApiItem[]>([[apiKey, items]])
      );

      const item = await new GetItems(fetchItems).fetch([id], apiKey);

      expect(item.length).toBe(1);
      expect(item[0].count).toBe(4);
    });
  });

  describe("get item from multiple sources", () => {
    it("should sum all occurrences of an item in all the sources", async () => {
      const id = 1;
      const apiKey = "AP1-K3Y";
      const fetchers = createFetchersForItemGroups([
        new Map<string, GW2ApiItem[]>(),
        new Map<string, GW2ApiItem[]>([[apiKey, [{ id, count: 5 }]]]),
        new Map<string, GW2ApiItem[]>([
          [
            apiKey,
            [
              { id, count: 3 },
              { id, count: 2 },
            ],
          ],
        ]),
      ]);

      const item = await new GetItemsFromMultipleSources(fetchers).fetch(
        [id],
        apiKey
      );

      expect(item.length).toBe(1);
      expect(item[0].count).toBe(10);
    });
  });

  describe("get multiple items from single source", () => {
    it("should sum all occurernces of an item in the source", async () => {
      const id1 = 1;
      const id2 = 2;
      const otherId = 3;
      const apiKey = "AP1-K3Y";
      const items = [
        { id: id2, count: 1 },
        { id: id1, count: 1 },
        { id: id1, count: 3 },
        { id: otherId, count: 10 },
      ];
      const fetchItems = storage(
        new Map<string, GW2ApiItem[]>([[apiKey, items]])
      );

      const foundItems = await new GetItems(fetchItems).fetch(
        [id1, id2],
        apiKey
      );
      const item1count = foundItems.filter((item) => item.id == id1)[0];
      const item2count = foundItems.filter((item) => item.id == id2)[0];

      expect(foundItems.length).toBe(2);
      expect(item1count.count).toBe(4);
      expect(item2count.count).toBe(1);
    });
  });
});
