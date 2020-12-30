import { Item } from "../gw2-items/item.interface";

export interface CharacterInventory {
  bags: [
    {
      inventory: Item[];
    }
  ];
}
