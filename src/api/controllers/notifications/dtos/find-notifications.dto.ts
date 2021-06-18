import {
  IsBooleanString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from "class-validator";
import { IsIdArray } from "../../raid-posts/validators/id-array.validator";

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

  @IsString()
  recipent: string;

  @IsOptional()
  @IsBooleanString()
  seen?: string;
}
