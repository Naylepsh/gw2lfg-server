import { GW2ApiItem } from "../../gw2-items/item.interface";
import { AllItemsFetcher } from "./all-items-fetcher.type";
import { countItemStacks } from "./count-item-stacks";
import { ItemsFetcher } from "./items-fetcher.interface";

/*
Uses a fetcher to fetch all items, leaves only those with given ids and merges items occurring multple times
*/
export class GetItems implements ItemsFetcher {
  constructor(private readonly fetchAllItems: AllItemsFetcher) {}

  async fetch(ids: number[], apiKey: string): Promise<GW2ApiItem[]> {
    try {
      const items = await this.fetchAllItems(apiKey);

      return ids.map((id) => ({ id, count: countItemStacks(items, id) }));
    } catch (error) {
      return [];
    }
  }
}
