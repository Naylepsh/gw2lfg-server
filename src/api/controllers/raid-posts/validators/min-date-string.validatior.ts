import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

/**
 * Custom validation constraint for checking whether given datestring is after the specified date
 */
@ValidatorConstraint()
export class MinDateStringConstraint implements ValidatorConstraintInterface {
  validate(str: string, args: ValidationArguments) {
    try {
      const minDate = this.getMinDate(args);
      return new Date(str) > minDate;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const minDate = this.getMinDate(args);
    return `minimal allowed date is ${minDate}`;
  }

  private getMinDate(args: ValidationArguments) {
    const dateConstraint = args.constraints[0];
    if (dateConstraint instanceof Date) return dateConstraint;
    if (typeof dateConstraint === "function") return dateConstraint() as Date;
    throw new Error("Unregistered constraint");
  }
}

/**
 * Custom validation decorator to be used with class-validator.
 * Uses custom MinDateStringContraint to check whether given datestring is after the specified date
 */
export function MinDateString(
  date: () => Date | Date,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [date],
      validator: MinDateStringConstraint,
    });
  };
}
