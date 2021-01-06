export interface ConcreteAccountFetcher {
  fetch(apiKey: string): Promise<Account[]>;
}
