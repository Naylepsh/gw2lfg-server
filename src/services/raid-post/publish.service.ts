import { Inject, Service } from "typedi";
import { RaidPost } from "@data/entities/raid-post.entitity";
import {
  RequirementArgs,
  requirementFactory
} from "@data/entities/requirement.factory";
import { Role } from "@data/entities/role.entity";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { UserNotFoundError } from "../errors/entity-not-found.error";
import { isDateInThePast } from "./is-date-in-the-past";
import { PastDateError } from "./raid-post-errors";
import { RolePropsDTO } from "./role-props.dto";

export interface PublishDTO {
  date: Date;
  server: string;
  description?: string;
  authorId: number;
  bossesIds: number[];
  rolesProps: RolePropsDTO[];
  requirementsProps: RequirementArgs[];
}

@Service()
export class PublishRaidPostService {
  constructor(
    @Inject(raidPostUnitOfWorkType) private readonly uow: IRaidPostUnitOfWork
  ) {}

  async publish(publishDto: PublishDTO) {
    if (isDateInThePast(publishDto.date)) throw new PastDateError("date");

    return await this.uow.withTransaction(() =>
      this.createAndSavePost(publishDto)
    );
  }

  private async createAndSavePost(publishDto: PublishDTO) {
    const author = await this.uow.users.findById(publishDto.authorId);
    if (!author) throw new UserNotFoundError();

    const requirements = publishDto.requirementsProps.map((req) =>
      requirementFactory.createRequirement(req)
    );
    await this.uow.requirements.saveMany(requirements);

    const roles = publishDto.rolesProps.map((props) => new Role(props));
    await this.uow.roles.saveMany(roles);

    const bossesIds = publishDto.bossesIds;
    const bosses = await this.uow.raidBosses.findByIds(bossesIds);

    const post = new RaidPost({
      ...publishDto,
      author,
      requirements,
      roles,
      bosses,
    });

    return this.uow.raidPosts.save(post);
  }
}
