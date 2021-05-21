import { inventoryUrl } from "../gw2-api.constants";
import { fetchItemsFromUrl } from "../utils/fetch-items-from-url";

/**
 * Fetches items from shared inventory associated with given API key from official GW2 API
 */
export const fetchItemsFromSharedInventory = async (apiKey: string) => {
  return fetchItemsFromUrl(inventoryUrl, apiKey);
};
