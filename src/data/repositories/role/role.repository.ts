import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { Role } from "../../entities/role/role.entity";
import { IdentifiableEntityRepository } from "../generic-identifiable-entity.repository";
import { IRoleRepository } from "./role.repository.interface";

@Service()
@EntityRepository(Role)
export class RoleRepository
  extends IdentifiableEntityRepository<Role>
  implements IRoleRepository {}
