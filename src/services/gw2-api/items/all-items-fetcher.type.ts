import { GW2ApiItem } from "./item.interface";

export type AllItemsFetcher = (apiKey: string) => Promise<GW2ApiItem[]>;
