import { Role } from "../entities/role.entity";
import { GenericRepository } from "./generic.repository";
import { IRepository } from "./repository.interface";

export interface IRoleRepository extends IRepository<Role> {}

export class RoleRepository
  extends GenericRepository<Role>
  implements IRoleRepository {}
