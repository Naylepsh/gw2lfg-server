import { InvalidPropertyError } from "../../common/errors/invalid-property.error";

export class DateIsInThePastError extends InvalidPropertyError {
  constructor(property: string) {
    super(property, `property ${property} cannot be a past date`);
  }
}
