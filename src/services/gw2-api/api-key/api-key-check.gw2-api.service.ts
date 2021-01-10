import { Service } from "typedi";
import { checkApiKeyValidityServiceType } from "../../../loaders/typedi.constants";
import {
  accountUrl,
  bankUrl,
  charactersUrl,
  inventoryUrl,
  tokenInfoUrl,
} from "../gw2-api.constants";
import { sendRequestWithBearerToken } from "../utils/send-request-with-bearer-token";

export interface ICheckApiKeyValidityService {
  isValid(apiKey: string): Promise<boolean>;
}

/*
Concrete CheckApiKeyValidityService implementations that checks given apiKey against official GW2API.
Sends request to official GW2API /tokeninfo and checks if given API key is valid and has all the required permissions.
*/
@Service(checkApiKeyValidityServiceType)
export class CheckApiKeyValidityService implements ICheckApiKeyValidityService {
  async isValid(apiKey: string): Promise<boolean> {
    try {
      const requiredPermissions = [
        "account",
        "characters",
        "inventories",
        "progression",
      ];

      const { data } = await sendRequestWithBearerToken(tokenInfoUrl, apiKey);
      const permissions: string[] = data.permissions;

      return requiredPermissions.every((permission) =>
        permissions.includes(permission)
      );
    } catch (error) {
      return false;
    }
  }
}
