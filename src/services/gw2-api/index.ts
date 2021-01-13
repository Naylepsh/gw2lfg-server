import { FindAccountService } from "./account/find-account.gw2-api.service";
import { CheckApiKeyValidityService } from "./api-key/api-key-check.gw2-api.service";
import {
  GetItemsFromEntireAccount,
} from "./items/get-items.gw2-api.service";
import {
  GetItemsFromMultipleSources
} from "./items/get-items-from-multiple-sources.fetcher";
import { GetItems } from "./items/get-items.fetcher";
import { FindRaidClearStatusService } from "./raids/find-raid-clear-status.gw2-api.service";

// Available gw2-api services
export default {
  FindAccountService,
  CheckApiKeyValidityService,
  GetItemsFromEntireAccount,
  GetItemsFromMultipleSources,
  GetItems,
  FindRaidClearStatusService,
};
