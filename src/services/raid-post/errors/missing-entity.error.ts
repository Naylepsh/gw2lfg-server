import { InvalidPropertyError } from "../../common/errors/invalid-property.error";

export class MissingEntityError extends InvalidPropertyError {
  constructor(entity: string) {
    super(entity, `entity ${entity} cannot be missing (or empty)`);
  }
}
