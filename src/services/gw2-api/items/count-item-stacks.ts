import { GW2ApiItem } from "../../gw2-items/item.interface";

/*
Counts the quantity of an item with given id in given items
*/
export const countItemStacks = (items: GW2ApiItem[], id: number) => {
  return items
    .filter((item) => item.id === id)
    .reduce((count, item) => count + item.count, 0);
};
