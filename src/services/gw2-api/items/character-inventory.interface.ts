import { GW2ApiItem } from "./item.interface";

export interface CharacterInventory {
  bags: (Bag | null)[];
}

interface Bag {
  inventory: GW2ApiItem[];
}
