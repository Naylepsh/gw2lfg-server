import { Inject, Service } from "typedi";
import { IRaidPostRepository } from "@data/repositories/raid-post/raid-post.repository.interface";
import {
  findRaidPostsServiceType,
  raidPostRepositoryType,
} from "@loaders/typedi.constants";
import {
  FindRaidPostsDTO,
  FindRaidPostsWhereParams,
  FindRaidPostsWhereRoleParams,
} from "./dtos/find-raid-posts.dto";
import { Like, MoreThan } from "typeorm";
import { RaidPost } from "@data/entities/raid-post/raid-post.entitity";

/*
Service for finding raid posts.
Returns paginated results.
Requires pagination params.
Where query is optional.
*/
@Service(findRaidPostsServiceType)
export class FindRaidPostsService {
  constructor(
    @Inject(raidPostRepositoryType)
    private readonly repository: IRaidPostRepository
  ) {}

  async find(dto: FindRaidPostsDTO) {
    const { skip, take, whereParams } = dto;
    const where = whereParams ? this.createWhereQuery(whereParams) : undefined;

    // const posts = await this.repository.findMany({
    //   order: { date: "ASC" },
    //   skip,
    //   take: take + 1,
    //   where,
    // });

    let posts = await this.repository.findMany({
      order: { date: "ASC" },
      where,
    });

    if (whereParams) {
      posts = this.filterByRelationProperties(whereParams, posts);
    }

    // due to TypeORM not handling advanced filtering on relationships, pagination has to be done after data retrieval
    return this.paginate(posts, skip, take);
  }

  private filterByRelationProperties(
    whereParams: FindRaidPostsWhereParams,
    posts: RaidPost[]
  ) {
    let filteredPosts = [...posts];

    if (whereParams?.authorName) {
      filteredPosts = this.filterPostsOfGivenAuthorName(
        filteredPosts,
        whereParams.authorName
      );
    }

    // leave only posts which contain given bosses ids
    if (whereParams?.bossesIds) {
      filteredPosts = this.filterPostsContainingGivenBosses(
        filteredPosts,
        whereParams.bossesIds
      );
    }

    // leave only posts which contain given role
    if (whereParams?.role) {
      filteredPosts = this.filterPostsContainingGivenRole(
        filteredPosts,
        whereParams.role
      );
    }

    return filteredPosts;
  }

  private filterPostsOfGivenAuthorName(posts: RaidPost[], authorName: string) {
    const loweredAuthorName = authorName.toLowerCase();
    return posts.filter((post) =>
      post.author.username.toLowerCase().includes(loweredAuthorName)
    );
  }

  private filterPostsContainingGivenRole(
    posts: RaidPost[],
    role: FindRaidPostsWhereRoleParams
  ) {
    return posts.filter((post) =>
      post.roles.some((postRole) => {
        // params are optional, thus undefined is a correct value
        const isCorrectName = [undefined, postRole.name].includes(role.name);
        const isCorrectClass = [undefined, postRole.class].includes(role.class);
        return isCorrectName && isCorrectClass;
      })
    );
  }

  private filterPostsContainingGivenBosses(
    posts: RaidPost[],
    bossesIds: number[]
  ) {
    return posts.filter((post) => {
      const postBossesIds = post.bosses.map((boss) => boss.id);
      return bossesIds?.every((id) => postBossesIds.includes(id));
    });
  }

  private paginate(posts: RaidPost[], skip: number, take: number) {
    posts = posts.slice(skip, skip + take + 1);

    return posts.length === 0
      ? { posts, hasMore: false }
      : { posts: posts.slice(0, take), hasMore: posts.length === take + 1 };
  }

  private createWhereQuery(params: FindRaidPostsWhereParams) {
    let where: any = {};
    const { minDate, server, authorId } = params;

    if (minDate) {
      where.date = MoreThan(minDate);
    }

    if (server) {
      where.server = Like(server);
    }

    if (authorId) {
      where.author = { id: authorId };
    }

    return where;
  }
}
