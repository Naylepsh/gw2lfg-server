import { IsOptional, IsBooleanString } from "class-validator";

export class UpdateNotificationsDTO {
  @IsOptional()
  @IsBooleanString()
  seen?: string;
}
