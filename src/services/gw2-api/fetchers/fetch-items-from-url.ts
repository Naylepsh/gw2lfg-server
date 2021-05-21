import { GW2ApiItem } from "../items/item.interface";
import { removeEmptySlots } from "../utils/remove-empty-slots";
import { sendGetRequestWithBearerToken } from "../utils/send-request-with-bearer-token";

/**
 * Fetches items from given url using given API key
 */
export const fetchItemsFromUrl = async (url: string, apiKey: string) => {
  const { data } = await sendGetRequestWithBearerToken<(GW2ApiItem | null)[]>(
    url,
    apiKey
  );
  return removeEmptySlots(data);
};
