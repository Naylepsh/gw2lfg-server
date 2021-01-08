import { IsNumber } from "class-validator";

export class SendJoinRequestDTO {
  @IsNumber()
  postId: number;

  @IsNumber()
  roleId: number;
}
