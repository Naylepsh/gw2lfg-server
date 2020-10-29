import axios from "axios";
import { Item } from "../gw2-items/item.interface";

const coreUrl = "https://api.guildwars2.com/v2";
const accountUrl = `${coreUrl}/account`;

export const fetchItemsFromBank = async (apiKey: string) => {
  try {
    const url = `${accountUrl}/bank`;
    const response = await sendRequestWithBearerToken(url, apiKey);
    const slots = response.data as any[];

    return removeEmptySlots(slots) as Item[];
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
