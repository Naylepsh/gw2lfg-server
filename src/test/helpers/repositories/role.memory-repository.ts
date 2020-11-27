import { Role } from "../../../core/entities/role.entity";
import { IRoleRepository } from "../../../core/repositories/role.repository.interface";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class RoleMemoryRepository
  extends IdentifiableMemoryRepository<Role>
  implements IRoleRepository {}
