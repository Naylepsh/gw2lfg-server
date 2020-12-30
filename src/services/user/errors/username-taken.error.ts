import { EntityAlreadyExistsError } from "../../common/errors/entity-already-exists.error";

export class UsernameTakenError extends EntityAlreadyExistsError {}
