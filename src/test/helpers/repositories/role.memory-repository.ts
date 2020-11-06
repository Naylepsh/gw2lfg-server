import { Role } from "../../../entities/role.entity";
import { IRoleRepository } from "../../../repositories/role.repository";
import { MemoryRepository } from "./memory-repository";

export class RoleMemoryRepository
  extends MemoryRepository<Role>
  implements IRoleRepository {}
