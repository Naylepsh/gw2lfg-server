import { Item } from "../../gw2-items/item.interface";
import { fetchItemsFromCharacter } from "../fetchers/fetch-items-from-character";
import { fetchCharacters } from "../fetchers/fetch-characters";
import { fetchItemsFromSharedInventory } from "../fetchers/fetch-items-from-shared-inventory";
import { fetchItemsFromBank } from "../fetchers/fetch-items-from-bank";
import { Service } from "typedi";
import { getItemsFromEntireAccountFetcherType } from "../../../loaders/typedi.constants";

type AllItemsFetcher = (apiKey: string) => Promise<Item[]>;

export interface ItemsFetcher {
  fetch(ids: number[], apiKey: string): Promise<Item[]>;
}

/*
Takes an array of item fetchers and merges their results
*/
export class GetItemsFromMultipleSources implements ItemsFetcher {
  constructor(private readonly fetchers: ItemsFetcher[]) {}

  async fetch(ids: number[], apiKey: string): Promise<Item[]> {
    const itemStacks = await Promise.all(
      this.fetchers.map((fetcher) => fetcher.fetch(ids, apiKey))
    );

    const counts = new Map<number, number>();
    for (const id of ids) {
      counts.set(id, 0);
    }

    // the same item can appear multiple times in inventory and have different quantity
    // that's why it's merged here
    for (const items of itemStacks) {
      for (const id of ids) {
        const count = countItemStacks(items, id);
        counts.set(id, counts.get(id)! + count);
      }
    }

    // map a map into an array of items (id, count)
    return Array.from(counts.keys()).map((id) => ({
      id,
      count: counts.get(id)!,
    }));
  }
}

/*
Uses a fetcher to fetch all items, leaves only those with given ids and merges items occurring multple times
*/
export class GetItems implements ItemsFetcher {
  constructor(private readonly fetchAllItems: AllItemsFetcher) {}

  async fetch(ids: number[], apiKey: string): Promise<Item[]> {
    try {
      const items = await this.fetchAllItems(apiKey);

      return ids.map((id) => ({ id, count: countItemStacks(items, id) }));
    } catch (error) {
      return [];
    }
  }
}

/*
Counts the quantity of an item with given id in given items
*/
const countItemStacks = (items: Item[], id: number) => {
  return items
    .filter((item) => item.id === id)
    .reduce((count, item) => count + item.count, 0);
};

export const getItemsFromBank = new GetItems(fetchItemsFromBank);

export const getItemsFromSharedInventory = new GetItems(
  fetchItemsFromSharedInventory
);

export const getItemsFromCharacter = (characterName: string) => {
  return new GetItems((apiKey: string) =>
    fetchItemsFromCharacter(characterName, apiKey)
  );
};

/*
Fetches all items with given ids from the account associated with given API key
*/
Service(getItemsFromEntireAccountFetcherType);
export class GetItemsFromEntireAccount implements ItemsFetcher {
  constructor() {}

  async fetch(ids: number[], apiKey: string): Promise<Item[]> {
    try {
      const characters = await fetchCharacters(apiKey);
      const characterItemFetchers = await Promise.all(
        characters.map((character) => getItemsFromCharacter(character))
      );

      return new GetItemsFromMultipleSources([
        ...characterItemFetchers,
        getItemsFromBank,
        getItemsFromSharedInventory,
      ]).fetch(ids, apiKey);
    } catch (error) {
      return [];
    }
  }
}
