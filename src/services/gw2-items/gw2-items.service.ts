import gw2items from "./items.json";

const nameIdPairs = Object.entries(gw2items);
const idNamePairs = nameIdPairs.map(([name, id]) => [id, name]);
const idToNameMap = Object.fromEntries(idNamePairs);

/**
 * Maps item name to its corresponding item id used by GW2 API
 */
export const nameToId = (name: string): number => {
  const defaultId = -1; // no item has this id, but it prevents more unexpected errors
  return (<Record<string, number>>gw2items)[name] ?? defaultId;
};

/**
 * Maps item id to its corresponding item name used by this service
 */
export const idToName = (id: number): string => {
  const defaultName = "N/A"; // prevents unexpected errors
  return idToNameMap[id] ?? defaultName;
};
