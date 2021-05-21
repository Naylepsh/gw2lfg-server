import { GW2ApiItem } from "./item.interface";
import { fetchItemsFromCharacter } from "../fetchers/fetch-items-from-character";
import { fetchCharacters } from "../fetchers/fetch-characters";
import { fetchItemsFromSharedInventory } from "../fetchers/fetch-items-from-shared-inventory";
import { fetchItemsFromBank } from "../fetchers/fetch-items-from-bank";
import { Service } from "typedi";
import { getItemsFromEntireAccountFetcherType } from "@loaders/typedi.constants";
import { GetItemsFromMultipleSources } from "./get-items-from-multiple-sources.fetcher";
import { GetItems } from "./get-items.fetcher";
import { ItemsFetcher } from "./items-fetcher.interface";

/**
 * Fetches all items with given ids from the account associated with given API key
 */
Service(getItemsFromEntireAccountFetcherType);
export class GetItemsFromEntireAccount implements ItemsFetcher {
  constructor() {}

  async fetch(ids: number[], apiKey: string): Promise<GW2ApiItem[]> {
    try {
      const characters = await fetchCharacters(apiKey);
      const characterItemFetchers = await Promise.all(
        characters.map((character) => this.getItemsFromCharacter(character))
      );

      return new GetItemsFromMultipleSources([
        ...characterItemFetchers,
        this.getItemsFromBank,
        this.getItemsFromSharedInventory,
      ]).fetch(ids, apiKey);
    } catch (error) {
      return [];
    }
  }

  private readonly getItemsFromBank = new GetItems(fetchItemsFromBank);

  private readonly getItemsFromSharedInventory = new GetItems(
    fetchItemsFromSharedInventory
  );

  private readonly getItemsFromCharacter = (characterName: string) => {
    return new GetItems((apiKey: string) =>
      fetchItemsFromCharacter(characterName, apiKey)
    );
  };
}
