import { GW2ApiItem } from "../../gw2-items/item.interface";
import { removeEmptySlots } from "../utils/remove-empty-slots";
import { sendRequestWithBearerToken } from "../utils/send-request-with-bearer-token";

/*
Fetches items from given url using given API key
*/
export const fetchItemsFromUrl = async (url: string, apiKey: string) => {
  const response = await sendRequestWithBearerToken(url, apiKey);
  const slots = response.data as any[];
  return removeEmptySlots(slots) as GW2ApiItem[];
};
