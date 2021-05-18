import {
  ArrayNotEmpty,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ItemRequirementProps } from "@root/data/entities/item-requirement/Item.requirement.props";

interface RequirementsProps {
  itemsProps: ItemRequirementProps[];
}

class RolePropsDTO {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  name: string;

  @IsString()
  class: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class SaveRaidPostDTO {
  @IsDateString()
  date: string;

  @IsString()
  server: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ArrayNotEmpty()
  @IsInt({ each: true })
  bossesIds: number[];

  @ArrayNotEmpty()
  @ValidateNested()
  rolesProps: RolePropsDTO[];

  @IsOptional()
  requirementsProps: RequirementsProps = { itemsProps: [] };
}
