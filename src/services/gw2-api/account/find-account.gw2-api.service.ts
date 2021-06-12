import { Service } from "typedi";
import { types } from "@loaders/typedi.constants";
import { fetchAccount, Gw2Account } from "./fetch-account";

export interface IFindAccountService {
  findAccount(apiKey: string): Promise<Gw2Account>;
}

/**
 * Concrete AccountFetcher implementation that fetches from official GW2API.
 * Returns an account with associated API key
 */
@Service(types.services.findAccount)
export class FindAccountService implements IFindAccountService {
  findAccount(apiKey: string): Promise<Gw2Account> {
    return fetchAccount(apiKey);
  }
}
