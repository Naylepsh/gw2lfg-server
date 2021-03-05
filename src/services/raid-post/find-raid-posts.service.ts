import { Inject, Service } from "typedi";
import { IRaidPostRepository } from "@data/repositories/raid-post/raid-post.repository.interface";
import {
  findRaidPostsServiceType,
  raidPostRepositoryType,
} from "@loaders/typedi.constants";
import {
  FindRaidPostsDTO,
  FindRaidPostsWhereParams,
} from "./dtos/find-raid-posts.dto";
import { Like, MoreThan } from "typeorm";

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
    const { skip, take, whereParams } = dto;
    const join = whereParams ? this.createJoinParams(whereParams) : undefined;
    const where = whereParams
      ? this.createWhereQueryBuilder(whereParams)
      : undefined;

    const posts = await this.repository.findMany({
      join,
      where,
      skip,
      take: take + 1,
    });

    return { posts: posts.slice(0, take), hasMore: posts.length === take + 1 };
  }

  /**
   * Creates join attributes required for proper query builder functioning
   */
  private createJoinParams(whereParams: FindRaidPostsWhereParams) {
    const alias = "post";
    let leftJoin: Record<string, string> = {};

    if (whereParams.author) {
      leftJoin.author = `${alias}.author`;
    }

    if (whereParams.role) {
      leftJoin.roles = `${alias}.roles`;
    }

    if (whereParams.bossesIds) {
      leftJoin.bosses = `${alias}.bosses`;
    }

    return { alias, leftJoin };
  }

  private createWhereQueryBuilder(whereParams: FindRaidPostsWhereParams) {
    return (qb: any) => {
      this.addQueryOnRaidPostProps(whereParams, qb);
      this.addQueryOnAuthorProps(whereParams, qb);
      this.addQueryOnRoleProps(whereParams, qb);
      this.addQueryOnBossProps(whereParams, qb);
    };
  }

  private addQueryOnRaidPostProps(
    whereParams: FindRaidPostsWhereParams,
    qb: any
  ) {
    const { minDate, server } = whereParams;

    if (minDate) {
      qb.andWhere({ date: MoreThan(minDate) });
    }

    if (server) {
      qb.andWhere({ server: Like(server) });
    }
  }

  private addQueryOnAuthorProps(
    whereParams: FindRaidPostsWhereParams,
    qb: any
  ) {
    const { author } = whereParams;
    const id = author?.id;
    const name = author?.name;

    if (id) {
      qb.andWhere("author.id = :id", { id });
    }

    if (name) {
      qb.andWhere("author.username = :name", { name });
    }
  }

  private addQueryOnRoleProps(whereParams: FindRaidPostsWhereParams, qb: any) {
    const { role } = whereParams;

    if (role?.name) {
      qb.andWhere(
        "LOWER(roles.name) = LOWER(:roleName) OR LOWER(roles.name) = 'any'",
        { roleName: role.name }
      );
    }

    if (role?.class) {
      qb.andWhere(
        "LOWER(roles.class) = LOWER(:roleClass) OR LOWER(roles.class) = 'any'",
        { roleClass: role.class }
      );
    }
  }

  private addQueryOnBossProps(whereParams: FindRaidPostsWhereParams, qb: any) {
    const { bossesIds } = whereParams;

    if (bossesIds) {
      for (const bossId of bossesIds) {
        qb.andWhere("bosses.id = :bossId", { bossId });
      }
    }
  }
}
