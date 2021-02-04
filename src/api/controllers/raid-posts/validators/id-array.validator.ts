import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

function isInteger(str: string) {
  const x = Math.floor(Number(str));
  return x !== Infinity && String(x) === str && x >= 0;
}

/*
Custom validation constraint for checking whether given string is an array of ids
*/
@ValidatorConstraint({ async: true })
export class IsIdArrayConstraint implements ValidatorConstraintInterface {
  validate(str: string, _args: ValidationArguments) {
    return str.split(",").every(isInteger);
  }

  defaultMessage(_args: ValidationArguments) {
    return "At least one of the values in the array is not a valid id";
  }
}

/*
Custom validation decorator to be used with class-validator.
Uses custom IsValidApiKeyConstraint to check whether given string is an array of ids
*/
export function IsIdArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIdArrayConstraint,
    });
  };
}
