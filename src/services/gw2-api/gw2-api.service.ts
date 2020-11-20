import { Item } from "../gw2-items/item.interface";
import {
  fetchCharacters,
  fetchItemsFromBank,
  fetchItemsFromCharacter,
  fetchItemsFromSharedInventory,
} from "./gw2-api.proxy";

type ConcreteItemsFetcher = (ids: string[], apiKey: string) => Promise<Item[]>;
type AllItemsFetcher = (apiKey: string) => Promise<Item[]>;

export const getItemFromMultipleSources = (
  itemFetchers: ConcreteItemsFetcher[]
): ConcreteItemsFetcher => {
  return async (ids: string[], apiKey: string): Promise<Item[]> => {
    const itemStacks = await Promise.all(
      itemFetchers.map((fetch) => fetch(ids, apiKey))
    );

    const counts = new Map<string, number>();
    for (const id of ids) {
      counts.set(id, 0);
    }

    for (const items of itemStacks) {
      for (const id of ids) {
        const count = countItemStacks(items, id);
        counts.set(id, counts.get(id)! + count);
      }
    }

    return Array.from(counts.keys()).map((id) => ({
      id,
      count: counts.get(id)!,
    }));
  };
};

export const getItems = (fetchItems: AllItemsFetcher): ConcreteItemsFetcher => {
  return async (ids: string[], apiKey: string) => {
    try {
      const items = await fetchItems(apiKey);

      return ids.map((id) => ({ id, count: countItemStacks(items, id) }));
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

export const getItemFromBank = getItems(fetchItemsFromBank);

export const getItemFromSharedInventory = getItems(
  fetchItemsFromSharedInventory
);

export const getItemFromCharacter = (characterName: string) => {
  return getItems((apiKey: string) =>
    fetchItemsFromCharacter(characterName, apiKey)
  );
};

export const getItemFromEntireAccount: ConcreteItemsFetcher = async (
  ids: string[],
  apiKey: string
) => {
  const characters = await fetchCharacters(apiKey);
  const characterItemFetchers = await Promise.all(
    characters.map((character) => getItemFromCharacter(character))
  );

  return getItemFromMultipleSources([
    ...characterItemFetchers,
    getItemFromBank,
    getItemFromSharedInventory,
  ])(ids, apiKey);
};
