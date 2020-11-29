import { IsDateString, IsInt } from "class-validator";
import { RequirementArgs } from "../../../data/entities/requirement.factory";
import { Role } from "../../../data/entities/role.entity";

export class RaidPostDTO {
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
