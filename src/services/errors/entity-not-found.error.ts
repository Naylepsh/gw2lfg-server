export class EntityNotFoundError extends Error {}

export class PostNotFoundError extends EntityNotFoundError {}

export class UserNotFoundError extends EntityNotFoundError {}

export class RoleNotFoundError extends EntityNotFoundError {}
