import { GetItems } from "@root/services/gw2-api/items/get-items.gw2-api.service";
import { GW2ApiItem } from "@services/gw2-items/item.interface";

type ItemStorage = Map<string, GW2ApiItem[]>;

export const storage = (items: ItemStorage = new Map<string, GW2ApiItem[]>()) => {
  return (apiKey: string): Promise<GW2ApiItem[]> =>
    new Promise((resolve) => resolve(items.get(apiKey) ?? []));
};

const createItemFetcher = (items: ItemStorage = new Map<string, GW2ApiItem[]>()) => {
  const itemsFetcher = storage(items);
  return new GetItems(itemsFetcher);
};

export const createFetchersForItemGroups = (itemGroups: ItemStorage[]) => {
  return itemGroups.map(createItemFetcher);
};

export class MyStorage {
  constructor(public readonly items: ItemStorage = new Map<string, GW2ApiItem[]>()) {}

  fetch(apiKey: string): Promise<GW2ApiItem[]> {
    return new Promise((resolve) => resolve(this.items.get(apiKey) ?? []));
  }
}
