import { Inject, Service } from "typedi";
import {
  IRaidPostRepository,
  RaidPostWhereParams,
} from "@data/repositories/raid-post/raid-post.repository.interface";
import {
  findRaidPostsServiceType,
  raidPostRepositoryType,
} from "@loaders/typedi.constants";
import {
  FindRaidPostsDTO,
  FindRaidPostsWhereParams,
} from "./dtos/find-raid-posts.dto";

/**
 * Service for finding raid posts.
 * Returns paginated results.
 */
@Service(findRaidPostsServiceType)
export class FindRaidPostsService {
  constructor(
    @Inject(raidPostRepositoryType)
    private readonly repository: IRaidPostRepository
  ) {}

  async find(dto: FindRaidPostsDTO) {
    const query = this.createPaginatedQuery(dto);

    const posts = await this.repository.findMany(query);

    return {
      posts: posts.slice(0, dto.take),
      hasMore: posts.length === dto.take + 1,
    };
  }

  createPaginatedQuery(dto: FindRaidPostsDTO) {
    const { skip, take, whereParams } = dto;
    const where = whereParams ? this.createWhereQuery(whereParams) : undefined;

    return {
      where,
      skip,
      take: take + 1,
      order: { date: "ASC" },
    } as const;
  }

  createWhereQuery(whereParams: FindRaidPostsWhereParams) {
    let where: RaidPostWhereParams = {};
    where.server = whereParams.server;
    where.minDate = whereParams.minDate
      ? new Date(whereParams.minDate)
      : undefined;
    where.author = whereParams.author;
    where.bossesIds = whereParams.bossesIds;
    if (whereParams.role) {
      const { name, class: roleClass } = whereParams.role;
      where.role = {};
      if (name && !isAny(name)) {
        where.role.eitherName = [name, "any"];
      }
      if (roleClass && !isAny(roleClass)) {
        where.role.eitherClass = [roleClass, "any"];
      }
    }
    return where;
  }
}

function isAny(value: string) {
  return value.toLowerCase() === "any";
}
