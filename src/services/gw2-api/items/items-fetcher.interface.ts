import { GW2ApiItem } from "../../gw2-items/item.interface";

export interface ItemsFetcher {
  fetch(ids: number[], apiKey: string): Promise<GW2ApiItem[]>;
}
