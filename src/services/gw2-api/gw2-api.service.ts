import { Item } from "../gw2-items/item.interface";
import {
  fetchCharacters,
  fetchItemsFromBank,
  fetchItemsFromCharacter,
  fetchItemsFromSharedInventory,
} from "./gw2-api.proxy";

type AllItemsFetcher = (apiKey: string) => Promise<Item[]>;

export interface ConcreteItemsFetcher {
  fetch(ids: string[], apiKey: string): Promise<Item[]>;
}

export class GetItemsFromMultipleSources implements ConcreteItemsFetcher {
  constructor(private readonly fetchers: ConcreteItemsFetcher[]) {}

  async fetch(ids: string[], apiKey: string): Promise<Item[]> {
    const itemStacks = await Promise.all(
      this.fetchers.map((fetcher) => fetcher.fetch(ids, apiKey))
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
  }
}

export class GetItems implements ConcreteItemsFetcher {
  constructor(private readonly fetchAllItems: AllItemsFetcher) {}

  async fetch(ids: string[], apiKey: string): Promise<Item[]> {
    try {
      const items = await this.fetchAllItems(apiKey);

      return ids.map((id) => ({ id, count: countItemStacks(items, id) }));
    } catch (error) {
      return [];
    }
  }
}

const countItemStacks = (items: Item[], id: string) => {
  return items
    .filter((item) => item.id === id)
    .reduce((count, item) => count + item.count, 0);
};

export const getItemFromBank = new GetItems(fetchItemsFromBank);

export const getItemFromSharedInventory = new GetItems(
  fetchItemsFromSharedInventory
);

export const getItemFromCharacter = (characterName: string) => {
  return new GetItems((apiKey: string) =>
    fetchItemsFromCharacter(characterName, apiKey)
  );
};

export class GetItemsFromEntireAccount implements ConcreteItemsFetcher {
  constructor() {}

  async fetch(ids: string[], apiKey: string): Promise<Item[]> {
    try {
      const characters = await fetchCharacters(apiKey);
      const characterItemFetchers = await Promise.all(
        characters.map((character) => getItemFromCharacter(character))
      );

      return new GetItemsFromMultipleSources([
        ...characterItemFetchers,
        getItemFromBank,
        getItemFromSharedInventory,
      ]).fetch(ids, apiKey);
    } catch (error) {
      return [];
    }
  }
}
