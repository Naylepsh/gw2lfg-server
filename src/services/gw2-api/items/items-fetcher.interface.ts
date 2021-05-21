import { GW2ApiItem } from "./item.interface";

export interface ItemsFetcher {
  fetch(ids: number[], apiKey: string): Promise<GW2ApiItem[]>;
}
