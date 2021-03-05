import { bankUrl } from "../gw2-api.constants";
import { fetchItemsFromUrl } from "./fetch-items-from-url";

/**
 * Fetches items from a bank associated with given API key from official GW2 API
 */
export const fetchItemsFromBank = (apiKey: string) => {
  return fetchItemsFromUrl(bankUrl, apiKey);
};
