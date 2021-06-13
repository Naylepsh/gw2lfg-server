import { Get, JsonController, QueryParams } from "routing-controllers";
import { FindNotificationsService } from "../../../services/notification/find-notifications.service";

import {
  IsBooleanString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from "class-validator";
import { IsIdArray } from "../raid-posts/validators/id-array.validator";

export class FindNotificationsDTO {
  @IsOptional()
  @IsInt()
  @IsPositive()
  take: number = 10;

  @IsOptional()
  @IsInt()
  @Min(0)
  skip: number = 0;

  @IsOptional()
  @IsString()
  @IsIdArray()
  ids?: string;

  @IsOptional()
  @IsString()
  recipent?: string;

  @IsOptional()
  @IsBooleanString()
  seen?: string;
}

/**
 * Controller for GET /notifications requests.
 * Returns paginated result of matched notifications.
 */
@JsonController()
export class FindNotificationsController {
  constructor(private readonly findService: FindNotificationsService) {}

  // TODO: only allow users to show their own notifications
  @Get("/notifications")
  async find(@QueryParams() dto: FindNotificationsDTO) {
    const notifications = await this.findService.find(this.parseDto(dto));

    return { data: notifications };
  }

  private parseDto(dto: FindNotificationsDTO) {
    const seen = dto.seen ? (JSON.parse(dto.seen!) as boolean) : undefined;
    return { ...dto, seen };
  }
}
