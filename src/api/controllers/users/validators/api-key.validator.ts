import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import Container from "typedi";
import { types } from "@loaders/typedi.constants";
import { ICheckApiKeyValidityService } from "@services/gw2-api/api-key/api-key-check.gw2-api.service";

/**
 * Custom validation constraint for checking whether given GW2 API key is valid
 */
@ValidatorConstraint({ async: true })
export class IsValidApiKeyConstraint implements ValidatorConstraintInterface {
  async validate(apiKey: string, _args: ValidationArguments) {
    const apiKeyValidatorService: ICheckApiKeyValidityService = Container.get(
      types.services.checkApiKeyValidity
    );

    const isValid = await apiKeyValidatorService.isValid(apiKey);

    return isValid;
  }

  defaultMessage(_args: ValidationArguments) {
    return "Invalid API key";
  }
}

/**
 * Custom validation decorator to be used with class-validator.
 * Uses custom IsValidApiKeyConstraint to check API key validity.
 */
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
