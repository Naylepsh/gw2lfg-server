import { Service } from "typedi";
import { checkApiKeyValidityServiceType } from "../../../loaders/typedi.constants";
import {
  accountUrl,
  bankUrl,
  charactersUrl,
  inventoryUrl,
} from "../gw2-api.constants";
import { sendRequestWithBearerToken } from "../utils/send-request-with-bearer-token";

export interface ICheckApiKeyValidityService {
  isValid(apiKey: string): Promise<boolean>;
}

/*
Concrete CheckApiKeyValidityService implementations that checks given apiKey against official GW2API.
Sends requests to all official GW2API routes used using given apiKey.
If any of them failed, the key is either invalid itself or has insufficient permission
for us that's the same thing - the key is invalid.
*/
@Service(checkApiKeyValidityServiceType)
export class CheckApiKeyValidityService implements ICheckApiKeyValidityService {
  async isValid(apiKey: string): Promise<boolean> {
    try {
      await Promise.all([
        sendRequestWithBearerToken(accountUrl, apiKey),
        sendRequestWithBearerToken(charactersUrl, apiKey),
        sendRequestWithBearerToken(inventoryUrl, apiKey),
        sendRequestWithBearerToken(bankUrl, apiKey),
      ]);

      return true;
    } catch (error) {
      return false;
    }
  }
}
