import { GW2ApiItem } from "../../gw2-items/item.interface";
import { CharacterInventory } from "../character-inventory";
import { charactersUrl } from "../gw2-api.constants";
import { removeEmptySlots } from "../utils/remove-empty-slots";
import { sendGetRequestWithBearerToken } from "../utils/send-request-with-bearer-token";

/**
 * Fetches items from a character associated with given API key from official GW2 API
 */
export const fetchItemsFromCharacter = async (
  characterName: string,
  apiKey: string
) => {
  try {
    const url = `${charactersUrl}/${characterName}`;
    const { data } = await sendGetRequestWithBearerToken(url, apiKey);

    const charInventory = data as CharacterInventory;
    const inventories = removeEmptySlots(
      charInventory.bags.filter((bag) => !!bag).map((bag) => bag.inventory)
    ) as GW2ApiItem[][];

    return removeEmptySlots(inventories.flat()) as GW2ApiItem[];
  } catch (error) {
    throw error;
  }
};
