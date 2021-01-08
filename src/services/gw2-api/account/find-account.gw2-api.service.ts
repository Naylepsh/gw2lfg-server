import { Service } from "typedi";
import { findAccountServiceType } from "../../../loaders/typedi.constants";
import { fetchAccount, Gw2Account } from "../fetchers/fetch-account";

export interface AccountFetcher {
  fetch(apiKey: string): Promise<Gw2Account>;
}

@Service(findAccountServiceType)
export class FindAccountService implements AccountFetcher {
  fetch(apiKey: string): Promise<Gw2Account> {
    return fetchAccount(apiKey);
  }
}
