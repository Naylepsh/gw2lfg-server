import { IsDateString, IsInt, IsOptional, IsString } from "class-validator";
import { ItemRequirementProps } from "@root/data/entities/item-requirement/Item.requirement.props";

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

  @IsString()
  server: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt({ each: true })
  bossesIds: number[];

  @IsOptional()
  rolesProps: RolePropsDTO[] = [];

  @IsOptional()
  requirementsProps: RequirementsProps = { itemsProps: [] };
}
