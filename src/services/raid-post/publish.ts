import { RaidPost } from "../../entities/raid-post.entitity";
import { Role } from "../../entities/role.entity";
import {
  RequirementArgs,
  requirementFactory,
} from "../../entities/requirement.factory";
import { IRaidPostUnitOfWork } from "../../repositories/raid-post.unit-of-work";

export class InvalidPropertyError extends Error {
  constructor(public readonly property: string, message: string) {
    super(message);
  }
}

export class PastDateError extends InvalidPropertyError {
  constructor(property: string) {
    super(property, `property ${property} cannot be a past date`);
  }
}

export interface PublishDTO {
  raidPostProps: Pick<RaidPost, "date" | "server" | "description">;
  authorId: number;
  bossesIds: number[];
  rolesProps: Pick<Role, "name" | "description">[];
  requirementsProps: RequirementArgs[];
}

export const publish = async (
  publishDto: PublishDTO,
  raidPostUow: IRaidPostUnitOfWork
) => {
  if (isDateInThePast(publishDto.raidPostProps.date))
    throw new PastDateError("date");

  return await raidPostUow.withTransaction(() =>
    createAndSavePost(publishDto, raidPostUow)
  );
};

const isDateInThePast = (date: Date) => {
  return new Date() > date;
};

const createAndSavePost = async (
  publishDto: PublishDTO,
  raidPostUow: IRaidPostUnitOfWork
) => {
  const author = await raidPostUow.users.findById(publishDto.authorId);
  if (!author) throw new Error("unregistered user");

  const requirements = publishDto.requirementsProps.map((req) =>
    requirementFactory.createRequirement(req)
  );
  const requirementRepository = raidPostUow.requirements;
  await Promise.all(requirements.map((req) => requirementRepository.save(req)));

  const roles = publishDto.rolesProps.map((props) => new Role(props));
  const roleRepository = raidPostUow.roles;
  await Promise.all(roles.map((role) => roleRepository.save(role)));

  const bossesIds = publishDto.bossesIds;
  const bosses = await raidPostUow.raidBosses.findByIds(bossesIds);

  const post = new RaidPost({
    ...publishDto.raidPostProps,
    author,
    requirements,
    roles,
    bosses,
  });
  return await raidPostUow.raidPosts.save(post);
};
