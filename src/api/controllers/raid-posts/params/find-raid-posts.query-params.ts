import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class FindRaidPostsQueryParams {
  @IsOptional()
  @IsInt()
  @IsPositive()
  take: number = 10;

  @IsOptional()
  @IsInt()
  @Min(0)
  skip: number = 0;
}
