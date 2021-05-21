import { IsInt, IsOptional, IsPositive } from "class-validator";

export class FindJoinRequestsDTO {
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
