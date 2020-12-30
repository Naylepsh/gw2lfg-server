import { Inject, Service } from "typedi";
import { RaidPost } from "@data/entities/raid-post.entitity";
import { Role } from "@data/entities/role.entity";
import { ItemRequirement } from "@data/entities/item.requirement.entity";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { raidPostUnitOfWorkType } from "@loaders/typedi.constants";
import { EntityNotFoundError } from "../errors/entity-not-found.error";
import { isDateInThePast } from "./utils/is-date-in-the-past";
import { PastDateError } from "./errors/raid-post-errors";
import { RolePropsDTO } from "./dtos/role-props.dto";
import { RequirementsPropsDTO } from "./dtos/requirements-props.dto";

export interface UpdateRaidPostDTO {
  id: number;
  date: Date;
  server: string;
  description?: string;
  bossesIds: number[];
  rolesProps: RolePropsDTO[];
  requirementsProps: RequirementsPropsDTO;
}

@Service()
export class UpdateRaidPostService {
  constructor(
    @Inject(raidPostUnitOfWorkType) private readonly uow: IRaidPostUnitOfWork
  ) {}

  async update(dto: UpdateRaidPostDTO) {
    if (isDateInThePast(dto.date)) throw new PastDateError("date");

    return this.uow.withTransaction(async () => {
      const raidPost = await this.uow.raidPosts.findById(dto.id);

      if (!raidPost) {
        throw new EntityNotFoundError(`raid post with id ${dto.id} not found`);
      }

      const author = raidPost.author;
      const bosses = await getBosses(this.uow, dto.bossesIds);

      if (raidPost.hasRoles()) {
        await this.uow.roles.delete(raidPost.roles);
      }
      const roles = await createRoles(dto.rolesProps, this.uow);

      if (raidPost.hasRequirements()) {
        await this.uow.requirements.delete(raidPost.requirements);
      }
      const requirements = await createRequirements(
        dto.requirementsProps,
        this.uow
      );

      const post = new RaidPost({
        ...dto,
        author,
        requirements,
        roles,
        bosses,
      });
      post.id = raidPost.id;

      return await this.uow.raidPosts.save(post);
    });
  }
}

// const getAuthor = async (uow: IRaidPostUnitOfWork, authorId: number) => {
//   const author = await uow.users.findById(authorId);
//   if (!author)
//     throw new EntityNotFoundError(`user with id ${authorId} not found`);
//   return author;
// };

const getBosses = (uow: IRaidPostUnitOfWork, bossesIds: number[]) => {
  return uow.raidBosses.findByIds(bossesIds);
};

const createRoles = (rolesProps: RolePropsDTO[], uow: IRaidPostUnitOfWork) => {
  const roles = rolesProps.map((props) => new Role(props));
  return uow.roles.saveMany(roles);
};

const createRequirements = (
  requirementsProps: RequirementsPropsDTO,
  uow: IRaidPostUnitOfWork
) => {
  const requirements = requirementsProps.itemsProps.map(
    (props) => new ItemRequirement(props)
  );
  return uow.requirements.saveMany(requirements);
};
