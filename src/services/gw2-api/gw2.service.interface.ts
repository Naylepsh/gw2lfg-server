import { Item } from "../gw2-items/item.interface";

export interface IGW2APIService {
  getItem(name: string, apiKey: string): Item;
}
