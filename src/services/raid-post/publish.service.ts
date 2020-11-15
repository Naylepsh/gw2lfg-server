import { RaidPost } from "../../entities/raid-post.entitity";
import { Role } from "../../entities/role.entity";
import {
  RequirementArgs,
  requirementFactory,
} from "../../entities/requirement.factory";
import { IRaidPostUnitOfWork } from "../../repositories/raid-post.unit-of-work";
import { isDateInThePast } from "./is-date-in-the-past";
import { PastDateError } from "./raid-post-errors";

export interface PublishDTO {
  date: Date;
  server: string;
  description?: string;
  authorId: number;
  bossesIds: number[];
  rolesProps: Pick<Role, "name" | "description">[];
  requirementsProps: RequirementArgs[];
}

export const publish = async (
  publishDto: PublishDTO,
  raidPostUow: IRaidPostUnitOfWork
) => {
  if (isDateInThePast(publishDto.date)) throw new PastDateError("date");

  return raidPostUow.withTransaction(() =>
    createAndSavePost(publishDto, raidPostUow)
  );
};

const createAndSavePost = async (
  publishDto: PublishDTO,
  uow: IRaidPostUnitOfWork
) => {
  const author = await uow.users.findById(publishDto.authorId);
  if (!author) throw new Error("unregistered user");

  const requirements = publishDto.requirementsProps.map((req) =>
    requirementFactory.createRequirement(req)
  );
  await uow.requirements.saveMany(requirements);

  const roles = publishDto.rolesProps.map((props) => new Role(props));
  await uow.roles.saveMany(roles);

  const bossesIds = publishDto.bossesIds;
  const bosses = await uow.raidBosses.findByIds(bossesIds);

  const post = new RaidPost({
    ...publishDto,
    author,
    requirements,
    roles,
    bosses,
  });
  return await uow.raidPosts.save(post);
};
