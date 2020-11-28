import { Role } from "../../entities/role.entity";
import { IdentifiableEntityRepository } from "../generic.repository";
import { IRoleRepository } from "./role.repository.interface";

export class RoleRepository
  extends IdentifiableEntityRepository<Role>
  implements IRoleRepository {}
