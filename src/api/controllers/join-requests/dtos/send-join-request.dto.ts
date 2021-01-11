import { IsInt, IsPositive } from "class-validator";

export class SendJoinRequestDTO {
  @IsInt()
  @IsPositive()
  postId: number;

  @IsInt()
  @IsPositive()
  roleId: number;
}
