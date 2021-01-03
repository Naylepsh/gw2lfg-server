import { MinLength } from "class-validator";

export class LoginDTO {
  @MinLength(6)
  username: string;

  @MinLength(6)
  password: string;
}
