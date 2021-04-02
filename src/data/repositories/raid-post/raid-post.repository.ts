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
  implements IRaidPostRepository {
  save(post: RaidPost): Promise<RaidPost> {
    return this.repository.save(post);
  }

  findOne(params: RaidPostQueryParams): Promise<RaidPost | undefined> {
    const { join, where } = parseFindRaidPostQuery(params);
    return this.repository.findOne({
      join,
      where,
      relations: RaidPostRepository.relations,
    });
  }

  findMany(params: RaidPostsQueryParams): Promise<RaidPost[]> {
    const { skip, take } = params;
    const { join, where } = parseFindRaidPostQuery(params);
    return this.repository.find({
      skip,
      take,
      join,
      where,
      relations: RaidPostRepository.relations,
    });
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria);
  }

  private static relations = ["author", "requirements", "bosses", "roles"];
}

export function parseFindRaidPostQuery(queryParams: RaidPostQueryParams) {
  const { whereParams } = queryParams;

  const { join: corePostJoin, where: corePostWhere } = parseFindPostQuery(
    queryParams
  );
  const raidPostJoin = whereParams ? createJoinParams(whereParams) : undefined;
  const raidPostWhere = whereParams
    ? createWhereQueryBuilder(whereParams)
    : undefined;

  const join = mergeJoins(corePostJoin, raidPostJoin);
  const where = mergeWhere(corePostWhere, raidPostWhere);

  return { join, where };
}

/**
 * Creates join attributes required for proper query builder functioning
 */
function createJoinParams(whereParams: RaidPostWhereParams) {
  const { bossesIds } = whereParams;
  const alias = "post";
  let join: Record<string, string> = {};

  if (bossesIds) {
    join.bosses = `${alias}.bosses`;
  }

  return { alias, innerJoin: join };
}

function createWhereQueryBuilder(whereParams: RaidPostWhereParams) {
  return (qb: any) => {
    addQueryOnBossProps(whereParams, qb);
  };
}

function addQueryOnBossProps(whereParams: RaidPostWhereParams, qb: any) {
  const { bossesIds } = whereParams;

  if (bossesIds) {
    for (const bossId of bossesIds) {
      qb.andWhere("bosses.id = :bossId", { bossId });
    }
  }
}

interface Join {
  alias: string;
  innerJoin: Record<string, string>;
}

function mergeJoins(join1: Join | undefined, join2: Join | undefined) {
  if (join1 && join2) {
    return {
      alias: join1.alias,
      innerJoin: { ...join1.innerJoin, ...join2.innerJoin },
    };
  }
  return join1 ?? join2;
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
