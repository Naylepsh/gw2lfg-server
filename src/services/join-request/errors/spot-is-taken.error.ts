import { EntityAlreadyExistsError } from "../../common/errors/entity-already-exists.error";

export class SpotIsTakenError extends EntityAlreadyExistsError {}
