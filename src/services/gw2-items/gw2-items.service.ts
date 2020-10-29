import * as gw2items from "./items.json";

export const nameToId = (name: string): string => {
  return (<any>gw2items)[name];
};
