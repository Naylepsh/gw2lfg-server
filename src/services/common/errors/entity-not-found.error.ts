export class EntityNotFoundError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class PostNotFoundError extends EntityNotFoundError {
  constructor(message: string = "Post not found") {
    super(message);
  }
}

export class UserNotFoundError extends EntityNotFoundError {
  constructor(message: string = "User not found") {
    super(message);
  }
}

export class RoleNotFoundError extends EntityNotFoundError {
  constructor(message: string = "Role not found") {
    super(message);
  }
}
