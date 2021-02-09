import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from "class-validator";
import { IsIdArray } from "../validators/id-array.validator";

export class FindRaidPostsQueryParams {
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
  bossesIds?: string;

  @IsOptional()
  @IsInt()
  authorId?: number;

  @IsOptional()
  @IsString()
  authorName?: string;

  @IsOptional()
  @IsString()
  roleName?: string;

  @IsOptional()
  @IsString()
  roleClass?: string;

  @IsOptional()
  @IsDateString()
  minDate?: string;

  @IsOptional()
  @IsString()
  server?: string;
}
