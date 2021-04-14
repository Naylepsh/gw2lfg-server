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
import { In } from "typeorm";

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
    if (dto.date && isDateInThePast(dto.date))
      throw new DateIsInThePastError("date");

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

    // prepare related entities
    const author = raidPost.author;
    const [bosses, roles, requirements] = await Promise.all([
      this.uow.raidBosses.findByIds(dto.bossesIds),
      this.updateRoles(raidPost, dto),
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
  private async updateRoles(raidPost: RaidPost, dto: UpdateRaidPostDTO) {
    const newRoles = dto.rolesProps.map((props) => {
      const role = new Role(props);
      if (props.id) {
        role.id = props.id;
      }
      return role;
    });
    const idsOfNewRoles = newRoles.map((r) => r.id);
    const idsOfOutdatedRoles = (raidPost.roles ?? [])
      .map((r) => r.id)
      .filter((id) => !idsOfNewRoles.includes(id));

    await this.uow.joinRequests.delete({
      post: { id: raidPost.id },
      role: { id: In(idsOfOutdatedRoles) },
    });

    const [, roles] = await Promise.all([
      this.uow.roles.delete(idsOfOutdatedRoles),
      this.uow.roles.saveMany(newRoles),
    ]);

    return roles;
  }
}
