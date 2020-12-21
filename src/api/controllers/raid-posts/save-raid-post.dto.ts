import { IsDateString, IsInt } from "class-validator";
import { RequirementArgs } from "@data/entities/requirement.factory";

interface RolePropsDTO {
  name: string;
  class: string;
  description?: string;
}

export class SaveRaidPostDTO {
  @IsDateString()
  date: Date;

  // TODO: Custom @IsServer() validator
  server: string;

  description?: string;

  @IsInt({ each: true })
  bossesIds: number[];

  rolesProps: RolePropsDTO[] = [];

  requirementsProps: RequirementArgs[] = [];
}
