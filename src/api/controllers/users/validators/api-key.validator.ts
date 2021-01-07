import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import Container from "typedi";
import { checkApiKeyValidityServiceType } from "@loaders/typedi.constants";
import { ICheckApiKeyValidityService } from "@services/gw2-api/api-key/api-key-check.gw2-api.service";

@ValidatorConstraint({ async: true })
export class IsValidApiKeyConstraint implements ValidatorConstraintInterface {
  async validate(apiKey: string, _args: ValidationArguments) {
    const apiKeyValidatorService: ICheckApiKeyValidityService = Container.get(
      checkApiKeyValidityServiceType
    );

    const isValid = await apiKeyValidatorService.isValid(apiKey);

    return isValid;
  }

  defaultMessage(_args: ValidationArguments) {
    return "Invalid API key";
  }
}

export function IsValidApiKey(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidApiKeyConstraint,
    });
  };
}
