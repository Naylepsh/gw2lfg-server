import * as gw2items from "./items.json";

/*
Maps item name to its corresponding item id used by GW2 API
*/
export const nameToId = (name: string): string => {
  return (<any>gw2items)[name];
};
