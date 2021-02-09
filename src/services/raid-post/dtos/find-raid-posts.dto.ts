import { Role } from "@data/entities/role/role.entity";

export interface FindRaidPostsDTO {
  skip: number;
  take: number;
  whereParams?: FindRaidPostsWhereParams;
}

export interface FindRaidPostsWhereParams {
  minDate?: string;
  server?: string;
  authorId?: number;
  authorName?: string;
  bossesIds?: number[];
  role?: FindRaidPostsWhereRoleParams;
}

export type FindRaidPostsWhereRoleParams = Partial<
  Pick<Role, "name" | "class">
>;
