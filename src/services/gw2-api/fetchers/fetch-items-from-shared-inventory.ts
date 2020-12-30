import { inventoryUrl } from "../gw2-api.constants";
import { fetchItemsFromUrl } from "./fetch-items-from-url";

export const fetchItemsFromSharedInventory = async (apiKey: string) => {
  return fetchItemsFromUrl(inventoryUrl, apiKey);
};
