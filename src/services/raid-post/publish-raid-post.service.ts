import { Inject, Service } from "typedi";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { Role } from "@root/data/entities/role/role.entity";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { ItemRequirement } from "@root/data/entities/item-requirement/item.requirement.entity";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { UserNotFoundError } from "../common/errors/entity-not-found.error";
import { isDateInThePast } from "./utils/is-date-in-the-past";
import { DateIsInThePastError } from "./errors/date-is-in-the-past.error";
import { PublishRaidPostDTO } from "./dtos/publish-raid-post.dto";

/*
Service for raid post creation.
Creates and saves a given raid post if it contains valid data.
*/
@Service()
export class PublishRaidPostService {
  constructor(
    @Inject(raidPostUnitOfWorkType) private readonly uow: IRaidPostUnitOfWork
  ) {}

  async publish(publishDto: PublishRaidPostDTO) {
    if (isDateInThePast(publishDto.date))
      throw new DateIsInThePastError("date");

    return await this.uow.withTransaction(() =>
      this.createAndSavePost(publishDto)
    );
  }

  private async createAndSavePost(publishDto: PublishRaidPostDTO) {
    const author = await this.uow.users.findById(publishDto.authorId);
    if (!author) throw new UserNotFoundError();

    // prepare related entities
    const [bosses, requirements, roles] = await Promise.all([
      this.uow.raidBosses.findByIds(publishDto.bossesIds),
      this.saveRequirements(publishDto),
      this.saveRoles(publishDto),
    ]);

    const post = new RaidPost({
      ...publishDto,
      author,
      requirements,
      roles,
      bosses,
    });

    return this.uow.raidPosts.save(post);
  }

  private async saveRoles(publishDto: PublishRaidPostDTO) {
    const roles = publishDto.rolesProps.map((props) => new Role(props));

    await this.uow.roles.saveMany(roles);

    return roles;
  }

  private async saveRequirements(publishDto: PublishRaidPostDTO) {
    const itemRequirements = publishDto.requirementsProps.itemsProps.map(
      (props) => new ItemRequirement(props)
    );

    await this.uow.itemRequirements.saveMany(itemRequirements);

    return itemRequirements;
  }
}
