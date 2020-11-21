import { Role } from "../entities/role.entity";
import { IdentifiableEntityRepository } from "./generic.repository";
import { IRepository } from "./repository.interface";

export interface IRoleRepository extends IRepository<Role> {}

export class RoleRepository
  extends IdentifiableEntityRepository<Role>
  implements IRoleRepository {}
