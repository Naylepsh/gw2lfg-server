import { FindAccountService } from "./account/find-account.gw2-api.service";
import { CheckApiKeyValidityService } from "./api-key/api-key-check.gw2-api.service";
import {
  GetItems,
  GetItemsFromEntireAccount,
  GetItemsFromMultipleSources,
} from "./items/get-items.gw2-api.service";

// Available gw2-api services
export default {
  FindAccountService,
  CheckApiKeyValidityService,
  GetItemsFromEntireAccount,
  GetItemsFromMultipleSources,
  GetItems,
};
