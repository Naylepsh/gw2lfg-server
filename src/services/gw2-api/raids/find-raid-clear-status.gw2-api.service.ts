import { Service } from "typedi";
import { types } from "@loaders/typedi.constants";
import { fetchRaidClearStatus } from "./fetch-raid-clear-status";

export interface IFindRaidClearStatusService {
  findClearedRaids(apiKey: string): Promise<string[]>;
}

/**
 * Concrete RaidStatusFetcher implementation that fetches from official GW2API.
 * Returns a list of raid bosses cleared since the weekly reset of an account with associated API key
 */
@Service(types.services.findRaidClearStatus)
export class FindRaidClearStatusService implements IFindRaidClearStatusService {
  findClearedRaids(apiKey: string): Promise<string[]> {
    return fetchRaidClearStatus(apiKey);
  }
}
