import { Service } from "typedi";
import { findRaidClearStatusServiceType } from "@loaders/typedi.constants";
import { fetchRaidClearStatus } from "../fetchers/fetch-raid-clear-status";

export interface IFindRaidClearStatusService {
  findClearedRaids(apiKey: string): Promise<string[]>;
}

/**
 * Concrete RaidStatusFetcher implementation that fetches from official GW2API.
 * Returns a list of raid bosses cleared since the weekly reset of an account with associated API key
 */
@Service(findRaidClearStatusServiceType)
export class FindRaidClearStatusService implements IFindRaidClearStatusService {
  findClearedRaids(apiKey: string): Promise<string[]> {
    return fetchRaidClearStatus(apiKey);
  }
}
