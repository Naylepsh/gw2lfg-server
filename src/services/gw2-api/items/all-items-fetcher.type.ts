import { GW2ApiItem } from "../../gw2-items/item.interface";

export type AllItemsFetcher = (apiKey: string) => Promise<GW2ApiItem[]>;
