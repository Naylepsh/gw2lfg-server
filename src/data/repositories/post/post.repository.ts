import { Service } from "typedi";
import {
  AbstractRepository,
  EntityRepository,
  In,
  LessThan,
  Like,
  MoreThan,
  SelectQueryBuilder,
} from "typeorm";
import { JoinRequest } from "../../entities/join-request/join-request.entity";
import { Post } from "../../entities/post/post.entity";
import { Role } from "../../entities/role/role.entity";
import {
  findManyAndLoadRelations,
  findOneAndLoadRelations,
} from "../common/find-and-load-relations";
import { paginate } from "../common/paginate";
import {
  IPostRepository,
  PostQueryParams,
  PostsQueryParams,
  PostWhereAuthorParams,
  PostWhereJoinRequestParams,
  PostWhereParams,
  PostWhereRoleParams,
} from "./post.repository.interface";

@Service()
@EntityRepository(Post)
export class PostRepository
  extends AbstractRepository<Post>
  implements IPostRepository
{
  save(post: Post): Promise<Post> {
    return this.repository.save(post);
  }

  async findOne(params: PostQueryParams): Promise<Post | undefined> {
    const alias = "Post";
    const qb = this.repository.createQueryBuilder(alias);

    addPostQueriesOnPostQb(qb, alias, params.where);

    return findOneAndLoadRelations(
      qb,
      this.repository,
      PostRepository.relations
    );
  }

  async findMany(params: PostsQueryParams): Promise<Post[]> {
    const alias = "Post";
    const qb = this.repository.createQueryBuilder(alias);

    addPostQueriesOnPostQb(qb, alias, params.where);
    paginate(qb, params);

    return findManyAndLoadRelations(
      qb,
      this.repository,
      PostRepository.relations
    );
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria.where ?? criteria);
  }

  private static relations = [
    "author",
    "requirements",
    "roles",
    "joinRequests",
  ];
}

export const addPostQueriesOnPostQb = async <T extends Post>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  whereParams?: PostWhereParams
) => {
  if (!whereParams) return;

  const { author, role, joinRequest } = whereParams;

  addQueryOnPostProps(whereParams, qb);
  author && addQueryOnAuthorProps(author, alias, qb);
  role && addQueryOnRoleProps(role, alias, qb);
  joinRequest && addQueryOnJoinRequestProps(joinRequest, alias, qb);
};

/**
 * qb here should stay as any type. Adding SelectQueryBuilder<Post> will make the compiler yell
 * as ab.andWhere supposedly doesn't accept { key: value } arguments.
 * Amusingly, without typings it works properly nonetheless.
 */
const addQueryOnPostProps = (whereParams: PostWhereParams, qb: any) => {
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
};

const addQueryOnAuthorProps = <T extends Post>(
  author: PostWhereAuthorParams,
  parentAlias: string,
  qb: SelectQueryBuilder<T>
) => {
  const { id, name } = author;
  const alias = "author";

  qb.leftJoin(`${parentAlias}.${alias}`, alias);

  if (id) {
    qb.andWhere(`${alias}.id = :id`, { id });
  }

  if (name) {
    qb.andWhere(`${alias}.username = :name`, { name });
  }
};

const addQueryOnRoleProps = <T extends Post>(
  role: PostWhereRoleParams,
  parentAlias: string,
  qb: SelectQueryBuilder<T>
) => {
  const { name, class: roleClass } = role;
  const alias = "role";

  qb.leftJoin(Role, alias, `"${alias}"."postId" = "${parentAlias}"."id"`);

  if (name) {
    const sql = Array.isArray(name)
      ? `LOWER(${alias}.name) IN (:...name)`
      : `LOWER(${alias}.name) = :name`;
    qb.andWhere(sql, { name });
  }

  if (roleClass) {
    const sql = Array.isArray(roleClass)
      ? `LOWER(${alias}.class) IN (:...class)`
      : `LOWER(${alias}.class) = :class`;
    qb.andWhere(sql, { class: roleClass });
  }
};

const addQueryOnJoinRequestProps = <T extends Post>(
  joinRequest: PostWhereJoinRequestParams,
  parentAlias: string,
  qb: SelectQueryBuilder<T>
) => {
  const { status, authorId } = joinRequest;
  const alias = "joinRequest";

  qb.leftJoin(
    JoinRequest,
    alias,
    `"${alias}"."postId" = "${parentAlias}"."id"`
  );

  if (status) {
    qb.andWhere(`${alias}.status = :status`, { status });
  }

  if (authorId) {
    // typeorm requires this exact format I guess (enclosing it within single "" doesnt work)
    qb.andWhere(`"${alias}"."userId" = :id`, { id: authorId });
  }
};
