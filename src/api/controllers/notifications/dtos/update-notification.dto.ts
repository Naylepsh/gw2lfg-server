import { IsOptional, IsBoolean } from "class-validator";

export class UpdateNotificationDTO {
  @IsOptional()
  @IsBoolean()
  seen?: boolean;
}
