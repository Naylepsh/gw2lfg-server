import { GW2ApiItem } from "../../gw2-items/item.interface";
import { fetchItemsFromCharacter } from "../fetchers/fetch-items-from-character";
import { fetchCharacters } from "../fetchers/fetch-characters";
import { fetchItemsFromSharedInventory } from "../fetchers/fetch-items-from-shared-inventory";
import { fetchItemsFromBank } from "../fetchers/fetch-items-from-bank";
import { Service } from "typedi";
import { getItemsFromEntireAccountFetcherType } from "@loaders/typedi.constants";
import { GetItemsFromMultipleSources } from "./get-items-from-multiple-sources.fetcher";
import { GetItems } from "./get-items.fetcher";
import { ItemsFetcher } from "./items-fetcher.interface";

export const getItemsFromBank = new GetItems(fetchItemsFromBank);

export const getItemsFromSharedInventory = new GetItems(
  fetchItemsFromSharedInventory
);

export const getItemsFromCharacter = (characterName: string) => {
  return new GetItems((apiKey: string) =>
    fetchItemsFromCharacter(characterName, apiKey)
  );
};

/*
Fetches all items with given ids from the account associated with given API key
*/
Service(getItemsFromEntireAccountFetcherType);
export class GetItemsFromEntireAccount implements ItemsFetcher {
  constructor() {}

  async fetch(ids: number[], apiKey: string): Promise<GW2ApiItem[]> {
    try {
      const characters = await fetchCharacters(apiKey);
      const characterItemFetchers = await Promise.all(
        characters.map((character) => getItemsFromCharacter(character))
      );

      return new GetItemsFromMultipleSources([
        ...characterItemFetchers,
        getItemsFromBank,
        getItemsFromSharedInventory,
      ]).fetch(ids, apiKey);
    } catch (error) {
      return [];
    }
  }
}
