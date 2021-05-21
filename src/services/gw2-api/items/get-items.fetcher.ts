import { GW2ApiItem } from "./item.interface";
import { countItemStacks } from "./item.utils";
import { ItemsFetcher } from "./items-fetcher.interface";

type AllItemsFetcher = (apiKey: string) => Promise<GW2ApiItem[]>;

/**
 * Uses a fetcher to fetch all items, leaves only those with given ids and merges items occurring multple times
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
