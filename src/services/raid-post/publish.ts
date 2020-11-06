import { RaidPost } from "../../entities/raid-post.entitity";
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

export const publish = async (
  post: RaidPost,
  raidPostRepository: IRaidPostRepository,
  userRepository: IUserRepository,
  requirementRepository: IRequirementRepository,
  roleRepository: IRoleRepository,
  raidBossRepository: IRaidBossRepository
) => {
  if (isDateInThePast(post.date)) throw new PastDateError("date");
  const author = { ...post.author };
  await userRepository.save(author);

  const requirements = [...post.requirements];
  await Promise.all(requirements.map((req) => requirementRepository.save(req)));

  const roles = [...post.roles];
  await Promise.all(roles.map((role) => roleRepository.save(role)));

  const bosses = [...post.bosses];
  await Promise.all(bosses.map((boss) => raidBossRepository.save(boss)));

  const _post = { ...post, author, requirements, roles, bosses };
  return raidPostRepository.save(_post);
};

const isDateInThePast = (date: Date) => {
  return new Date() > date;
};
