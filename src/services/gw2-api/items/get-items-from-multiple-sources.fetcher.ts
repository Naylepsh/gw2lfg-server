import { GW2ApiItem } from "./item.interface";
import { countItemStacks } from "./count-item-stacks";
import { ItemsFetcher } from "./items-fetcher.interface";

/**
 * Takes an array of item fetchers and merges their results
 */
export class GetItemsFromMultipleSources implements ItemsFetcher {
  constructor(private readonly fetchers: ItemsFetcher[]) {}

  async fetch(ids: number[], apiKey: string): Promise<GW2ApiItem[]> {
    const itemStacks = await Promise.all(
      this.fetchers.map((fetcher) => fetcher.fetch(ids, apiKey))
    );

    /**
     * The same item can appear multiple times in inventory and have different quantity
     * that's why it's merged here
     */
    const counts = new Map<number, number>();
    for (const items of itemStacks) {
      for (const id of ids) {
        const prevCount = counts.get(id) ?? 0;
        const count = countItemStacks(items, id);
        counts.set(id, prevCount + count);
      }
    }

    // map a Map into an array of items (id, count)
    return Array.from(counts.keys()).map((id) => ({
      id,
      count: counts.get(id) ?? 0,
    }));
  }
}
