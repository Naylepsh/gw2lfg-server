import { Inject, Service } from "typedi";
import { RaidPost } from "@data/entities/raid-post.entitity";
import { Role } from "@data/entities/role.entity";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { ItemRequirement } from "@data/entities/item.requirement.entity";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { UserNotFoundError } from "../common/errors/entity-not-found.error";
import { isDateInThePast } from "./utils/is-date-in-the-past";
import { PastDateError } from "./errors/raid-post-errors";
import { PublishRaidPostDTO } from "./dtos/publish-raid-post.dto";

@Service()
export class PublishRaidPostService {
  constructor(
    @Inject(raidPostUnitOfWorkType) private readonly uow: IRaidPostUnitOfWork
  ) {}

  async publish(publishDto: PublishRaidPostDTO) {
    if (isDateInThePast(publishDto.date)) throw new PastDateError("date");

    return await this.uow.withTransaction(() =>
      this.createAndSavePost(publishDto)
    );
  }

  private async createAndSavePost(publishDto: PublishRaidPostDTO) {
    const author = await this.uow.users.findById(publishDto.authorId);
    if (!author) throw new UserNotFoundError();

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
    const requirements = publishDto.requirementsProps.itemsProps.map(
      (props) => new ItemRequirement(props)
    );

    await this.uow.requirements.saveMany(requirements);

    return requirements;
  }
}
