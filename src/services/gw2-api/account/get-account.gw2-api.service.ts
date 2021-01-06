import { fetchAccount, Gw2Account } from "../fetchers/fetch-account";

export interface AccountFetcher {
  fetch(apiKey: string): Promise<Gw2Account>;
}

export class GetAccount implements AccountFetcher {
  fetch(apiKey: string): Promise<Gw2Account> {
    return fetchAccount(apiKey);
  }
}
