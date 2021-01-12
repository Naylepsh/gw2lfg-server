import { GW2ApiItem } from "../gw2-items/item.interface";

export interface CharacterInventory {
  bags: [
    {
      inventory: GW2ApiItem[];
    }
  ];
}
