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
  joinRequest?: FindRaidPostsWhereJoinRequestParams;
}

export interface FindRaidPostsWhereAuthorParams {
  id?: number;
  name?: string;
}

export interface FindRaidPostsWhereRoleParams {
  name?: string;
  class?: string;
}

export interface FindRaidPostsWhereJoinRequestParams {
  status?: string;
  authorId?: number;
}
