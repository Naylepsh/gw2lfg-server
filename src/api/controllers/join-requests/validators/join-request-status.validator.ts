import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { JoinRequestStatus } from "@data/entities/join-request/join-request.status";

/**
 * Custom validation constraint for checking whether given status is a valid join request status
 */
@ValidatorConstraint()
export class IsValidJoinRequestStatusConstraint
  implements ValidatorConstraintInterface {
  async validate(status: string, _args: ValidationArguments) {
    const validStatuses: JoinRequestStatus[] = ["ACCEPTED", "PENDING"];
    return validStatuses.includes(status as JoinRequestStatus);
  }

  defaultMessage(_args: ValidationArguments) {
    return "Invalid Join Request status";
  }
}

/**
 * Custom validation decorator to be used with class-validator.
 * Uses custom IsValidJoinRequestStatus to check status validity.
 */
export function IsValidJoinRequestStatus(
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidJoinRequestStatusConstraint,
    });
  };
}
