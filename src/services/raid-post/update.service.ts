import { RaidPost } from "../../entities/raid-post.entitity";
import {
  RequirementArgs,
  requirementFactory,
} from "../../entities/requirement.factory";
import { Role } from "../../entities/role.entity";
import { IRaidPostUnitOfWork } from "../../repositories/raid-post.unit-of-work";
import { isDateInThePast } from "./is-date-in-the-past";
import { PastDateError } from "./raid-post-errors";

export class EntityNotFoundError extends Error {}

type RoleProp = Pick<Role, "name" | "description">;

export interface UpdateRaidPostDTO {
  id: number;
  date: Date;
  server: string;
  description?: string;
  bossesIds: number[];
  rolesProps: RoleProp[];
  requirementsProps: RequirementArgs[];
}

export const update = async (
  updateDto: UpdateRaidPostDTO,
  uow: IRaidPostUnitOfWork
) => {
  if (isDateInThePast(updateDto.date)) throw new PastDateError("date");

  return uow.withTransaction(async () => {
    const raidPost = await uow.raidPosts.findById(updateDto.id);

    if (!raidPost) {
      throw new EntityNotFoundError(
        `raid post with id ${updateDto.id} not found`
      );
    }

    const author = raidPost.author;
    const bosses = await getBosses(uow, updateDto.bossesIds);

    await uow.roles.delete(raidPost.roles);
    const roles = await createRoles(updateDto.rolesProps, uow);

    await uow.requirements.delete(raidPost.requirements);
    const requirements = await createRequirements(
      updateDto.requirementsProps,
      uow
    );

    const post = new RaidPost({
      ...updateDto,
      author,
      requirements,
      roles,
      bosses,
    });
    post.id = raidPost.id;

    return await uow.raidPosts.save(post);
  });
};

// const getAuthor = async (uow: IRaidPostUnitOfWork, authorId: number) => {
//   const author = await uow.users.findById(authorId);
//   if (!author)
//     throw new EntityNotFoundError(`user with id ${authorId} not found`);
//   return author;
// };

const getBosses = async (uow: IRaidPostUnitOfWork, bossesIds: number[]) => {
  const bosses = await uow.raidBosses.findByIds(bossesIds);
  return bosses;
};

const createRoles = async (
  rolesProps: RoleProp[],
  uow: IRaidPostUnitOfWork
) => {
  const roles = rolesProps.map((props) => new Role(props));
  const roleRepository = uow.roles;
  return await Promise.all(roles.map((role) => roleRepository.save(role)));
};

const createRequirements = async (
  requirementsProps: RequirementArgs[],
  uow: IRaidPostUnitOfWork
) => {
  const requirements = requirementsProps.map((req) =>
    requirementFactory.createRequirement(req)
  );
  return await Promise.all(
    requirements.map((req) => uow.requirements.save(req))
  );
};
