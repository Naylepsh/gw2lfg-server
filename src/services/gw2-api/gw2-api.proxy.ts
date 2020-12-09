import axios from "axios";
import { Item } from "../gw2-items/item.interface";

interface CharacterInventory {
  bags: [
    {
      inventory: Item[];
    }
  ];
}

const coreUrl = "https://api.guildwars2.com/v2";
const accountUrl = `${coreUrl}/account`;
const characterUrl = `${coreUrl}/characters`;

export const fetchItemsFromBank = (apiKey: string) => {
  const url = `${accountUrl}/bank`;
  return fetchItemsFromUrl(url, apiKey);
};

export const fetchItemsFromSharedInventory = async (apiKey: string) => {
  const url = `${accountUrl}/inventory`;
  return fetchItemsFromUrl(url, apiKey);
};

const fetchItemsFromUrl = async (url: string, apiKey: string) => {
  try {
    const response = await sendRequestWithBearerToken(url, apiKey);
    const slots = response.data as any[];
    return removeEmptySlots(slots) as Item[];
  } catch (error) {
    throw error;
  }
};

export const fetchCharacters = async (apiKey: string) => {
  try {
    const response = await sendRequestWithBearerToken(characterUrl, apiKey);
    return response.data as string[];
  } catch (error) {
    throw error;
  }
};

export const fetchItemsFromCharacter = async (
  characterName: string,
  apiKey: string
) => {
  try {
    const url = `${characterUrl}/${characterName}`;
    const { data } = await sendRequestWithBearerToken(url, apiKey);

    const charInventory = data as CharacterInventory;
    const inventories = removeEmptySlots(
      charInventory.bags.filter((bag) => !!bag).map((bag) => bag.inventory)
    ) as Item[][];

    return removeEmptySlots(inventories.flat()) as Item[];
  } catch (error) {
    throw error;
  }
};

const sendRequestWithBearerToken = (url: string, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios.get(url, config);
};

const removeEmptySlots = (slots: any[]) => {
  return slots.filter((slot) => slot);
};
