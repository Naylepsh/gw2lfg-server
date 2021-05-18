import { Service } from "typedi";
import { AbstractRepository, EntityRepository } from "typeorm";
import { RaidPost } from "../../entities/raid-post/raid-post.entitity";
import {
  IRaidPostRepository,
  RaidPostQueryParams,
  RaidPostsQueryParams,
  RaidPostWhereParams,
} from "./raid-post.repository.interface";
import { parseFindPostQuery } from "../post/post.repository";

@Service()
@EntityRepository(RaidPost)
export class RaidPostRepository
  extends AbstractRepository<RaidPost>
  implements IRaidPostRepository
{
  save(post: RaidPost): Promise<RaidPost> {
    return this.repository.save(post);
  }

  findOne(params: RaidPostQueryParams): Promise<RaidPost | undefined> {
    const { where } = parseFindRaidPostQuery(
      params,
      RaidPostRepository.tableName
    );

    return this.repository.findOne({
      where,
      relations: RaidPostRepository.relations,
    });
  }

  findMany(params: RaidPostsQueryParams): Promise<RaidPost[]> {
    const { where } = parseFindRaidPostQuery(
      params,
      RaidPostRepository.tableName
    );

    return this.repository.find({
      ...params,
      where,
      relations: RaidPostRepository.relations,
    });
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria.where ?? criteria);
  }

  private static relations = [
    "author",
    "requirements",
    "bosses",
    "roles",
    "joinRequests",
  ];
  /**
   * Normally to check conditions on objects in relation in TypeORM one has to manually create join property in query builder.
   * However, using property relations already uses LEFT JOIN under the hood.
   * Adding that manual join on top of that would create up to twice as many joins.
   * To avoid that, in queryBuilder.where a table prefix is used, for example: RaidPost__bosses
   */
  private static tableName = "RaidPost";
}

export function parseFindRaidPostQuery(
  queryParams: RaidPostQueryParams,
  entityPrefix: string
) {
  const { where: corePostWhere } = parseFindPostQuery(
    queryParams,
    entityPrefix
  );
  const raidPostWhere = queryParams.where
    ? createWhereQueryBuilder(queryParams.where, entityPrefix)
    : undefined;

  const where = mergeWhere(corePostWhere, raidPostWhere);

  return { where };
}

function createWhereQueryBuilder(
  whereParams: RaidPostWhereParams,
  entityPrefix: string
) {
  return (qb: any) => {
    addQueryOnBossProps(whereParams, entityPrefix, qb);
  };
}

function addQueryOnBossProps(
  whereParams: RaidPostWhereParams,
  entityPrefix: string,
  qb: any
) {
  const { bossesIds } = whereParams;

  const bossEntity = `${entityPrefix}__bosses`;
  if (bossesIds) {
    for (const bossId of bossesIds) {
      qb.andWhere(`${bossEntity}.id = :bossId`, { bossId });
    }
  }
}

type Where = (qb: any) => void;

function mergeWhere(where1: Where | undefined, where2: Where | undefined) {
  if (where1 && where2) {
    return (qb: any) => {
      where1(qb);
      where2(qb);
    };
  }
  return where1 ?? where2;
}
