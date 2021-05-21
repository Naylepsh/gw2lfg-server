import { GW2ApiItem } from "../gw2-items/item.interface";

export interface CharacterInventory {
  bags: (Bag | null)[];
}

interface Bag {
  inventory: GW2ApiItem[];
}
