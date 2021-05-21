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
    const qb = this.repository.createQueryBuilder("Post");

    addPostQueriesOnPostQb(qb, params.where);
    addRaidPostQueriesOnRaidPostQb(qb, params.where);

    return findOneAndLoadRelations(
      qb,
      this.repository,
      RaidPostRepository.relations
    );
  }

  async findMany(params: RaidPostsQueryParams): Promise<RaidPost[]> {
    const qb = this.repository.createQueryBuilder("Post");

    addPostQueriesOnPostQb(qb, params.where);
    addRaidPostQueriesOnRaidPostQb(qb, params.where);
    paginate(qb, params);

    return findManyAndLoadRelations(
      qb,
      this.repository,
      RaidPostRepository.relations
    );
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
  whereParams?: RaidPostWhereParams
) => {
  if (!whereParams) return;

  const { bossesIds } = whereParams;

  bossesIds && addQueryOnBossProps(qb, bossesIds);
};

const addQueryOnBossProps = <T extends RaidPost>(
  qb: SelectQueryBuilder<T>,
  bossesIds: number[]
) => {
  const alias = "bosses";

  qb.leftJoin("Post.bosses", "bosses");
  if (bossesIds) {
    for (const bossId of bossesIds) {
      qb.andWhere(`${alias}.id = :bossId`, { bossId });
    }
  }
};
