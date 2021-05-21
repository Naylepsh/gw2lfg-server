import { CharacterInventory } from "./character-inventory.interface";
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
    const { data } = await sendGetRequestWithBearerToken<CharacterInventory>(
      url,
      apiKey
    );

    const inventories = removeEmptySlots(
      removeEmptySlots(data.bags).map((bag) => bag.inventory)
    );

    return removeEmptySlots(inventories.flat());
  } catch (error) {
    throw error;
  }
};
