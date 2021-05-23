import { Service } from "typedi";
import {
  AbstractRepository,
  EntityRepository,
  SelectQueryBuilder,
} from "typeorm";
import { RaidPost } from "../../entities/raid-post/raid-post.entitity";
import {
  IRaidPostRepository,
  RaidPostQueryParams,
  RaidPostsQueryParams,
  RaidPostWhereParams,
} from "./raid-post.repository.interface";
import { addPostQueriesOnPostQb } from "../post/post.repository";
import { paginate } from "../common/paginate";
import {
  findManyAndLoadRelations,
  findOneAndLoadRelations,
} from "../common/find-and-load-relations";
import { addOrder } from "../common/add-order";

@Service()
@EntityRepository(RaidPost)
export class RaidPostRepository
  extends AbstractRepository<RaidPost>
  implements IRaidPostRepository
{
  save(post: RaidPost): Promise<RaidPost> {
    return this.repository.save(post);
  }

  async findOne(params: RaidPostQueryParams): Promise<RaidPost | undefined> {
    const alias = "Post";
    const qb = this.repository.createQueryBuilder(alias);

    addPostQueriesOnPostQb(qb, alias, params.where);
    addRaidPostQueriesOnRaidPostQb(qb, alias, params.where);

    return findOneAndLoadRelations(qb, this.repository, {
      relations: RaidPostRepository.relations,
    });
  }

  async findMany(params: RaidPostsQueryParams): Promise<RaidPost[]> {
    const alias = "Post";
    const qb = this.repository.createQueryBuilder(alias);

    addPostQueriesOnPostQb(qb, alias, params.where);
    addRaidPostQueriesOnRaidPostQb(qb, alias, params.where);
    addOrder(qb, alias, params.order);
    paginate(qb, params);

    return findManyAndLoadRelations(qb, this.repository, {
      relations: RaidPostRepository.relations,
      order: params.order,
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
}

const addRaidPostQueriesOnRaidPostQb = <T extends RaidPost>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  whereParams?: RaidPostWhereParams
) => {
  if (!whereParams) return;

  const { bossesIds } = whereParams;

  bossesIds && addQueryOnBossProps(qb, alias, bossesIds);
};

const addQueryOnBossProps = <T extends RaidPost>(
  qb: SelectQueryBuilder<T>,
  parentAlias: string,
  bossesIds: number[]
) => {
  const alias = "bosses";

  qb.leftJoin(`${parentAlias}.${alias}`, alias);
  if (bossesIds) {
    for (const bossId of bossesIds) {
      qb.andWhere(`${alias}.id = :bossId`, { bossId });
    }
  }
};
