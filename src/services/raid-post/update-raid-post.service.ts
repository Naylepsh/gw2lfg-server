import { Inject, Service } from "typedi";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { Role } from "@root/data/entities/role/role.entity";
import { ItemRequirement } from "@root/data/entities/item-requirement/item.requirement.entity";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { EntityNotFoundError } from "../common/errors/entity-not-found.error";
import { isDateInThePast } from "./utils/is-date-in-the-past";
import { DateIsInThePastError } from "./errors/date-is-in-the-past.error";
import { UpdateRaidPostDTO } from "./dtos/update-raid-post.dto";

/**
 * Service for updating raid posts.
 * IMPORTANT! Update will remove all join requests pointing to the post!
 */
@Service()
export class UpdateRaidPostService {
  constructor(
    @Inject(raidPostUnitOfWorkType) private readonly uow: IRaidPostUnitOfWork
  ) {}

  async update(dto: UpdateRaidPostDTO) {
    if (isDateInThePast(dto.date)) throw new DateIsInThePastError("date");

    return this.uow.withTransaction(() => {
      return this.updatePost(dto);
    });
  }

  private async updatePost(dto: UpdateRaidPostDTO) {
    const raidPost = await this.uow.raidPosts.findOne({
      where: { id: dto.id },
    });

    if (!raidPost) {
      throw new EntityNotFoundError(`raid post with id ${dto.id} not found`);
    }

    await this.uow.joinRequests.delete({ post: { id: raidPost.id } });

    // prepare related entities
    const author = raidPost.author;
    const [bosses, roles, requirements] = await Promise.all([
      this.uow.raidBosses.findByIds(dto.bossesIds),
      this.overrideRoles(raidPost, dto),
      this.overrideRequirements(raidPost, dto),
    ]);

    const post = new RaidPost({
      ...dto,
      author,
      requirements,
      roles,
      bosses,
    });
    post.id = raidPost.id;

    return await this.uow.raidPosts.save(post);
  }

  // removes previous requirements and saves new ones
  private async overrideRequirements(
    raidPost: RaidPost,
    dto: UpdateRaidPostDTO
  ) {
    if (raidPost.hasRequirements()) {
      await this.uow.requirements.delete(raidPost.requirements);
    }

    const itemRequirements = await this.uow.itemRequirements.saveMany(
      dto.requirementsProps.itemsProps.map(
        (props) => new ItemRequirement(props)
      )
    );

    return itemRequirements;
  }

  // removes previous roles and saves new ones
  private async overrideRoles(raidPost: RaidPost, dto: UpdateRaidPostDTO) {
    if (raidPost.hasRoles()) {
      await this.uow.roles.delete(raidPost.roles);
    }

    const roles = await this.uow.roles.saveMany(
      dto.rolesProps.map((props) => new Role(props))
    );

    return roles;
  }
}
