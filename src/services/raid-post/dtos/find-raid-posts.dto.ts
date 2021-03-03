import { Role } from "@data/entities/role/role.entity";

export interface FindRaidPostsDTO {
  skip: number;
  take: number;
  whereParams?: FindRaidPostsWhereParams;
}

export interface FindRaidPostsWhereParams {
  minDate?: string;
  server?: string;
  bossesIds?: number[];
  author?: FindRaidPostsWhereAuthorParams;
  role?: FindRaidPostsWhereRoleParams;
}

export interface FindRaidPostsWhereAuthorParams {
  id?: number;
  name?: string;
}

export type FindRaidPostsWhereRoleParams = Partial<
  Pick<Role, "name" | "class">
>;
