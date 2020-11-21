import { Role } from "../../../entities/role.entity";
import { IRoleRepository } from "../../../repositories/role.repository";
import { IdentifiableMemoryRepository } from "./memory-repository";

export class RoleMemoryRepository
  extends IdentifiableMemoryRepository<Role>
  implements IRoleRepository {}
