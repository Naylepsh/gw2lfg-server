import { IsOptional, IsPositive, Min } from "class-validator";

export class FindRaidBossesQueryParams {
  @IsOptional()
  @IsPositive()
  take: number = 10;

  @IsOptional()
  @Min(0)
  skip: number = 0;
}
