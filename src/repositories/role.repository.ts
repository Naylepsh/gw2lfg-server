import { Role } from "../entities/role.entity";
import { IdentifiableEntityRepository } from "./generic.repository";
import { IIdentifiableEntityRepository } from "./repository.interface";

export interface IRoleRepository extends IIdentifiableEntityRepository<Role> {}

export class RoleRepository
  extends IdentifiableEntityRepository<Role>
  implements IRoleRepository {}
