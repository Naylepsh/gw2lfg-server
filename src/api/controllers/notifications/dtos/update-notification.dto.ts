import { IsOptional, IsBooleanString } from "class-validator";

export class UpdateNotificationDTO {
  @IsOptional()
  @IsBooleanString()
  seen?: string;
}
