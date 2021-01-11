import { IsInt, IsOptional, IsPositive } from "class-validator";

export class FindJoinRequestsQueryParams {
  @IsOptional()
  @IsInt()
  @IsPositive()
  userId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  postId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  roleId?: number;
}
