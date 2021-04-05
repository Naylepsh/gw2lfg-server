import { Service } from "typedi";
import {
  AbstractRepository,
  EntityRepository,
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
    const { join, where } = parseFindPostQuery(params);
    return this.repository.findOne({
      join,
      where,
      relations: PostRepository.relations,
    });
  }

  findMany(params: PostsQueryParams): Promise<Post[]> {
    const { skip, take } = params;
    const { join, where } = parseFindPostQuery(params);
    return this.repository.find({
      skip,
      take,
      join,
      where,
      relations: PostRepository.relations,
    });
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria);
  }

  public static relations = ["author", "requirements", "roles"];
}

export function parseFindPostQuery(queryParams: PostQueryParams) {
  const { where: whereParams } = queryParams;

  const join = whereParams ? createJoinParams(whereParams) : undefined;
  const where = whereParams ? createWhereQueryBuilder(whereParams) : undefined;

  return { join, where };
}

/**
 * Creates join attributes required for proper query builder functioning
 */
function createJoinParams(whereParams: PostWhereParams) {
  const { author, role } = whereParams;
  const alias = "post";
  let join: Record<string, string> = {};

  if (author) {
    join.author = `${alias}.author`;
  }

  if (role) {
    join.roles = `${alias}.roles`;
  }

  return { alias, innerJoin: join };
}

function createWhereQueryBuilder(whereParams: PostWhereParams) {
  return (qb: any) => {
    addQueryOnRaidPostProps(whereParams, qb);
    addQueryOnAuthorProps(whereParams, qb);
    addQueryOnRoleProps(whereParams, qb);
  };
}

function addQueryOnRaidPostProps(whereParams: PostWhereParams, qb: any) {
  const { id, minDate, maxDate, server } = whereParams;

  if (id) {
    qb.andWhere({ id });
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

function addQueryOnAuthorProps(whereParams: PostWhereParams, qb: any) {
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

function addQueryOnRoleProps(whereParams: PostWhereParams, qb: any) {
  const { role } = whereParams;
  const name = role?.name;
  const roleClass = role?.class;

  if (name) {
    const sql = Array.isArray(name)
      ? "LOWER(roles.name) IN (:...name)"
      : "LOWER(roles.name) = :name";
    qb.andWhere(sql, { name });
  }

  if (roleClass) {
    const sql = Array.isArray(roleClass)
      ? "LOWER(roles.class) IN (:...class)"
      : "LOWER(roles.class) = :class";
    qb.andWhere(sql, { class: roleClass });
  }
}
