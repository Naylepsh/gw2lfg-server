import { bankUrl } from "../gw2-api.constants";
import { fetchItemsFromUrl } from "./fetch-items-from-url";

export const fetchItemsFromBank = (apiKey: string) => {
  return fetchItemsFromUrl(bankUrl, apiKey);
};
