import { Service } from "typedi";
import { checkApiKeyValidityServiceType } from "../../../loaders/typedi.constants";
import { tokenInfoUrl } from "../gw2-api.constants";
import { sendGetRequestWithBearerToken } from "../utils/send-request-with-bearer-token";

export interface ICheckApiKeyValidityService {
  isValid(apiKey: string): Promise<boolean>;
}

/**
 * Concrete CheckApiKeyValidityService implementations that checks given apiKey against official GW2API.
 * Sends request to official GW2API /tokeninfo and checks if given API key is valid and has all the required permissions.
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

      const { data } = await sendGetRequestWithBearerToken<{
        permissions: string[];
      }>(tokenInfoUrl, apiKey);

      return requiredPermissions.every((permission) =>
        data.permissions.includes(permission)
      );
    } catch (error) {
      return false;
    }
  }
}
