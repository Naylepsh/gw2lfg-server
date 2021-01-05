import { EntityAlreadyExistsError } from "../common/errors/entity-already-exists.error";

export class MultipleRequestsForTheSameSpotError extends EntityAlreadyExistsError {}
