import { IsDateString, IsInt } from "class-validator";
import {
  Body,
  CurrentUser,
  HttpCode,
  JsonController,
  Post,
} from "routing-controllers";
import { RequirementArgs } from "../../../data/entities/requirement.factory";
import { Role } from "../../../data/entities/role.entity";
import { User } from "../../../data/entities/user.entity";
import { PublishRaidPostService } from "../../../services/raid-post/publish.service";

export class PublishDTO {
  @IsDateString()
  date: Date;

  // TODO: Custom @IsServer() validator
  server: string;

  description?: string;

  @IsInt({ each: true })
  bossesIds: number[];

  rolesProps: Pick<Role, "name" | "description">[] = [];

  requirementsProps: RequirementArgs[] = [];
}

@JsonController()
export class PublishRaidPostController {
  constructor(private readonly publishService: PublishRaidPostService) {}

  @HttpCode(201)
  @Post("/raid-post")
  async publish(
    @CurrentUser({ required: true }) user: User,
    @Body() dto: PublishDTO
  ) {
    return await this.publishService.publish({ ...dto, authorId: user.id });
  }
}
