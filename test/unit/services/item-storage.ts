import { GetItems } from "@services/gw2-api/gw2-api.service";
import { Item } from "@services/gw2-items/item.interface";

type ItemStorage = Map<string, Item[]>;

export const storage = (items: ItemStorage = new Map<string, Item[]>()) => {
  return (apiKey: string): Promise<Item[]> =>
    new Promise((resolve) => resolve(items.get(apiKey) ?? []));
};

const createItemFetcher = (items: ItemStorage = new Map<string, Item[]>()) => {
  const itemsFetcher = storage(items);
  return new GetItems(itemsFetcher);
};

export const createFetchersForItemGroups = (itemGroups: ItemStorage[]) => {
  return itemGroups.map(createItemFetcher);
};

export class MyStorage {
  constructor(public readonly items: ItemStorage = new Map<string, Item[]>()) {}

  fetch(apiKey: string): Promise<Item[]> {
    return new Promise((resolve) => resolve(this.items.get(apiKey) ?? []));
  }
}
