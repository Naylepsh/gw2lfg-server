import { Role } from "../../../data/entities/role.entity";
import { IRoleRepository } from "../../../data/repositories/role/role.repository.interface";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class RoleMemoryRepository
  extends IdentifiableMemoryRepository<Role>
  implements IRoleRepository {}
