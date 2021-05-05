import { Inject, Service } from "typedi";
import { RaidPost } from "@data/entities/raid-post/raid-post.entitity";
import { Role } from "@data/entities/role/role.entity";
import { ItemRequirement } from "@data/entities/item-requirement/item.requirement.entity";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { EntityNotFoundError } from "../common/errors/entity-not-found.error";
import { isDateInThePast } from "./utils/is-date-in-the-past";
import { DateIsInThePastError } from "./errors/date-is-in-the-past.error";
import { UpdateRaidPostDTO } from "./dtos/update-raid-post.dto";
import { In } from "typeorm";

/**
 * Service for updating raid posts.
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
      this.uow.raidBosses.findMany({ where: { id: dto.bossesIds } }),
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

    const itemRequirements = await this.uow.itemRequirements.save(
      dto.requirementsProps.itemsProps.map(
        (props) => new ItemRequirement(props)
      )
    );

    return itemRequirements;
  }

  // removes previous roles and saves new ones
  private async updateRoles(raidPost: RaidPost, dto: UpdateRaidPostDTO) {
    const newRoles = dto.rolesProps.map((props) => new Role(props));
    const idsOfNewRoles = newRoles.map((r) => r.id);
    const OutdatedRolesIds = (raidPost.roles ?? [])
      .map((r) => r.id)
      .filter((id) => !idsOfNewRoles.includes(id));

    await this.deleteOutdatedJoinRequests(raidPost.id, OutdatedRolesIds);

    const [, roles] = await Promise.all([
      this.deleteOutdatedRoles(OutdatedRolesIds),
      this.uow.roles.save(newRoles),
    ]);

    return roles;
  }

  private deleteOutdatedJoinRequests(
    postId: number,
    outdatedRoleIds: number[]
  ) {
    const deleteParams: Record<string, any> = { post: { id: postId } };
    if (outdatedRoleIds.length > 0) {
      deleteParams.role = { id: In(outdatedRoleIds) };
    }

    return this.uow.joinRequests.delete(deleteParams);
  }

  private deleteOutdatedRoles(outdatedRolesIds: number[]) {
    if (outdatedRolesIds.length > 0) {
      return this.uow.roles.delete({ id: In(outdatedRolesIds) });
    }
  }
}
