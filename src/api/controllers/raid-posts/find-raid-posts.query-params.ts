import { IsOptional, IsPositive, Min } from "class-validator";

export class FindRaidPostsQueryParams {
  @IsOptional()
  @IsPositive()
  take: number = 10;

  @IsOptional()
  @Min(0)
  skip: number = 0;
}
