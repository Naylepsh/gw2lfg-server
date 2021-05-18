import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { ItemRequirement } from "@root/data/entities/item-requirement/item.requirement.entity";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { Role } from "@root/data/entities/role/role.entity";
import { Inject, Service } from "typedi";
import { byId } from "@data/queries/common/by-id.query";
import { byIds } from "@data/queries/common/by-ids.query";
import { UserNotFoundError } from "../common/errors/entity-not-found.error";
import { CreateRaidPostDTO } from "./dtos/create-raid-post.dto";
import { DateIsInThePastError } from "./errors/date-is-in-the-past.error";
import { isDateInThePast } from "./utils/is-date-in-the-past";
import { MissingEntityError } from "./errors/missing-entity.error";

/**
 * Service for raid post creation.
 * Creates and saves a given raid post if it contains valid data.
 */
@Service()
export class CreateRaidPostService {
  constructor(
    @Inject(raidPostUnitOfWorkType) private readonly uow: IRaidPostUnitOfWork
  ) {}

  async create(dto: CreateRaidPostDTO) {
    if (isDateInThePast(dto.date)) throw new DateIsInThePastError("date");
    if (dto.bossesIds.length === 0) throw new MissingEntityError("bossesIds");
    if (dto.rolesProps.length === 0) throw new MissingEntityError("rolesProps");

    return await this.uow.withTransaction(() => this.createAndSavePost(dto));
  }

  private async createAndSavePost(dto: CreateRaidPostDTO) {
    const author = await this.uow.users.findOne(byId(dto.authorId));
    if (!author) throw new UserNotFoundError();

    // prepare related entities
    const [bosses, requirements, roles] = await Promise.all([
      this.uow.raidBosses.findMany(byIds(dto.bossesIds)),
      this.saveRequirements(dto),
      this.saveRoles(dto),
    ]);

    const post = new RaidPost({
      ...dto,
      author,
      requirements,
      roles,
      bosses,
    });

    return this.uow.raidPosts.save(post);
  }

  private async saveRoles(publishDto: CreateRaidPostDTO) {
    const roles = publishDto.rolesProps.map((props) => new Role(props));

    await this.uow.roles.save(roles);

    return roles;
  }

  private async saveRequirements(publishDto: CreateRaidPostDTO) {
    const itemRequirements = publishDto.requirementsProps.itemsProps.map(
      (props) => new ItemRequirement(props)
    );

    await this.uow.itemRequirements.save(itemRequirements);

    return itemRequirements;
  }
}
