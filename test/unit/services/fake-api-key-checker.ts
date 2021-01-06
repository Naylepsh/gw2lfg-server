import { ICheckApiKeyValidityService } from "@services/gw2-api/api-key/api-key-check.gw2-api.service";

export class FakeApiKeyChecker implements ICheckApiKeyValidityService {
  constructor(public areAllKeysValid: boolean) {}

  isValid(_apiKey: string): Promise<boolean> {
    return new Promise((resolve) => resolve(this.areAllKeysValid));
  }
}
