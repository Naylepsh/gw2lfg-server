import { MinLength } from "class-validator";
import { IsValidApiKey } from "../validators/api-key.validator";

export class RegisterDTO {
  @MinLength(6)
  username: string;

  @MinLength(6)
  password: string;

  @MinLength(1)
  @IsValidApiKey()
  apiKey: string;
}
