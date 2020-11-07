import { RaidPost } from "../../entities/raid-post.entitity";
import { Role } from "../../entities/role.entity";
import {
  RequirementArgs,
  requirementFactory,
} from "../../entities/requirement.factory";
import { IRaidBossRepository } from "../../repositories/raid-boss.repository";
import { IRaidPostRepository } from "../../repositories/raid-post.repository";
import { IRequirementRepository } from "../../repositories/requirement.repository";
import { IRoleRepository } from "../../repositories/role.repository";
import { IUserRepository } from "../../repositories/user.repository";

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
  raidPostRepository: IRaidPostRepository,
  userRepository: IUserRepository,
  requirementRepository: IRequirementRepository,
  roleRepository: IRoleRepository,
  raidBossRepository: IRaidBossRepository
) => {
  const { raidPostProps } = publishDto;
  if (isDateInThePast(raidPostProps.date)) throw new PastDateError("date");

  const author = await userRepository.findById(publishDto.authorId);
  if (!author) throw new Error("unregistered user");

  const requirements = publishDto.requirementsProps.map((req) =>
    requirementFactory.createRequirement(req)
  );
  await Promise.all(requirements.map((req) => requirementRepository.save(req)));

  const roles = publishDto.rolesProps.map((props) => new Role(props));
  await Promise.all(roles.map((role) => roleRepository.save(role)));

  const bossesIds = publishDto.bossesIds;
  const bosses = await raidBossRepository.findByIds(bossesIds);

  const post = new RaidPost({
    ...raidPostProps,
    author,
    requirements,
    roles,
    bosses,
  });
  return raidPostRepository.save(post);
};

const isDateInThePast = (date: Date) => {
  return new Date() > date;
};
