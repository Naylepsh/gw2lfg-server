import { Service } from "typedi";
import {
  AbstractRepository,
  EntityRepository,
  In,
  LessThan,
  Like,
  MoreThan,
} from "typeorm";
import { Post } from "../../entities/post/post.entity";
import {
  IPostRepository,
  PostQueryParams,
  PostsQueryParams,
  PostWhereParams,
} from "./post.repository.interface";

@Service()
@EntityRepository(Post)
export class PostRepository
  extends AbstractRepository<Post>
  implements IPostRepository {
  save(post: Post): Promise<Post> {
    return this.repository.save(post);
  }

  findOne(params: PostQueryParams): Promise<Post | undefined> {
    const { where } = parseFindPostQuery(params, PostRepository.tableName);
    return this.repository.findOne({
      where,
      relations: PostRepository.relations,
    });
  }

  findMany(params: PostsQueryParams): Promise<Post[]> {
    const { skip, take } = params;
    const { where } = parseFindPostQuery(params, PostRepository.tableName);
    return this.repository.find({
      skip,
      take,
      where,
      relations: PostRepository.relations,
    });
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria);
  }

  private static relations = ["author", "requirements", "roles"];
  /**
   * Normally to check conditions on objects in relation in TypeORM one has to manually create join property in query builder.
   * However, using property relations already uses LEFT JOIN under the hood.
   * Adding that manual join on top of that would create up to twice as many joins.
   * To avoid that, in queryBuilder.where a table prefix is used, for example: Post__author
   */
  private static tableName = "Post";
}

export function parseFindPostQuery(
  queryParams: PostQueryParams,
  entityPrefix: string
) {
  const where = queryParams.where
    ? createWhereQueryBuilder(queryParams.where, entityPrefix)
    : undefined;

  return { where };
}

function createWhereQueryBuilder(
  whereParams: PostWhereParams,
  entityPrefix: string
) {
  return (qb: any) => {
    addQueryOnPostProps(whereParams, qb);
    addQueryOnAuthorProps(whereParams, entityPrefix, qb);
    addQueryOnRoleProps(whereParams, entityPrefix, qb);
  };
}

function addQueryOnPostProps(whereParams: PostWhereParams, qb: any) {
  const { id, minDate, maxDate, server } = whereParams;

  if (id) {
    const idVal = Array.isArray(id) ? In(id) : id;
    qb.andWhere({ id: idVal });
  }

  if (minDate) {
    qb.andWhere({ date: MoreThan(minDate) });
  }

  if (maxDate) {
    qb.andWhere({ date: LessThan(maxDate) });
  }

  if (server) {
    qb.andWhere({ server: Like(server) });
  }
}

function addQueryOnAuthorProps(
  whereParams: PostWhereParams,
  entityPrefix: string,
  qb: any
) {
  const { author } = whereParams;
  const id = author?.id;
  const name = author?.name;

  const authorEntity = `${entityPrefix}__author`;

  if (id) {
    qb.andWhere(`${authorEntity}.id = :id`, { id });
  }

  if (name) {
    qb.andWhere(`${authorEntity}.username = :name`, { name });
  }
}

function addQueryOnRoleProps(
  whereParams: PostWhereParams,
  entityPrefix: string,
  qb: any
) {
  const { role } = whereParams;
  const name = role?.name;
  const roleClass = role?.class;

  const rolesEntity = `${entityPrefix}__roles`;
  if (name) {
    const sql = Array.isArray(name)
      ? `LOWER(${rolesEntity}.name) IN (:...name)`
      : `LOWER(${rolesEntity}.name) = :name`;
    qb.andWhere(sql, { name });
  }

  if (roleClass) {
    const sql = Array.isArray(roleClass)
      ? `LOWER(${rolesEntity}.class) IN (:...class)`
      : `LOWER(${rolesEntity}.class) = :class`;
    qb.andWhere(sql, { class: roleClass });
  }
}
