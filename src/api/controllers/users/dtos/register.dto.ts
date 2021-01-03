import { MinLength } from "class-validator";

export class RegisterDTO {
  @MinLength(6)
  username: string;

  @MinLength(6)
  password: string;

  @MinLength(1)
  apiKey: string;
}
