import { Item } from "../gw2-items/item.interface";
import { fetchItemsFromBank } from "./gw2-api.proxy";

type ItemFetcher = (id: string, apiKey: string) => Promise<Item>;
type ItemsFetcher = (apiKey: string) => Promise<Item[]>;

export const getItemFromMultipleSources = (
  itemFetchers: ItemFetcher[]
): ItemFetcher => {
  return async (id: string, apiKey: string): Promise<Item> => {
    const itemStacks = await Promise.all(
      itemFetchers.map((fetch) => fetch(id, apiKey))
    );
    const count = countItemStacks(itemStacks, id);

    return { id, count };
  };
};

export const getItem = (fetchItems: ItemsFetcher): ItemFetcher => {
  return async (id: string, apiKey: string) => {
    try {
      const items = await fetchItems(apiKey);
      const count = countItemStacks(items, id);

      return { id, count };
    } catch (error) {
      throw error;
    }
  };
};

const countItemStacks = (items: Item[], id: string) => {
  return items
    .filter((item) => item.id === id)
    .reduce((count, item) => count + item.count, 0);
};

export const getItemFromBank = getItem(fetchItemsFromBank);

export const getItemFromEntireAccount = getItemFromMultipleSources([
  getItemFromBank,
]);
