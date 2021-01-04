import { Inject, Service } from "typedi";
import { RaidPost } from "@data/entities/raid-post.entitity";
import { Role } from "@data/entities/role.entity";
import { ItemRequirement } from "@data/entities/item.requirement.entity";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { EntityNotFoundError } from "../common/errors/entity-not-found.error";
import { isDateInThePast } from "./utils/is-date-in-the-past";
import { PastDateError } from "./errors/raid-post-errors";
import { UpdateRaidPostDTO } from "./dtos/update-raid-post.dto";

@Service()
export class UpdateRaidPostService {
  constructor(
    @Inject(raidPostUnitOfWorkType) private readonly uow: IRaidPostUnitOfWork
  ) {}

  async update(dto: UpdateRaidPostDTO) {
    if (isDateInThePast(dto.date)) throw new PastDateError("date");

    return this.uow.withTransaction(() => {
      return this.updatePost(dto);
    });
  }

  private async updatePost(dto: UpdateRaidPostDTO) {
    const raidPost = await this.uow.raidPosts.findById(dto.id);

    if (!raidPost) {
      throw new EntityNotFoundError(`raid post with id ${dto.id} not found`);
    }

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
