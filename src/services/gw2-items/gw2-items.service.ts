import gw2items from "./items.json";

/*
Maps item name to its corresponding item id used by GW2 API
*/
export const nameToId = (name: string): number => {
  const defaultId = -1; // no item has this id, but it prevents more unexpected errors
  return (<Record<string, number>>gw2items)[name] ?? defaultId;
};
