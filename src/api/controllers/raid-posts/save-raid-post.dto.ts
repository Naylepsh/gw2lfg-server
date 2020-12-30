import { IsDateString, IsInt } from "class-validator";
import { ItemRequirementProps } from "@root/data/entities/Item.requirement.props";

interface RequirementsProps {
  itemsProps: ItemRequirementProps[];
}

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

  // TODO: validate
  rolesProps: RolePropsDTO[] = [];

  // TODO: validate
  requirementsProps: RequirementsProps = { itemsProps: [] };
}
