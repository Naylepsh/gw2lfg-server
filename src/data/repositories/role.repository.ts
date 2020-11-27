import { Role } from "../../core/entities/role.entity";
import { IdentifiableEntityRepository } from "./generic.repository";
import { IRoleRepository } from "../../core/repositories/role.repository.interface";

export class RoleRepository
  extends IdentifiableEntityRepository<Role>
  implements IRoleRepository {}
