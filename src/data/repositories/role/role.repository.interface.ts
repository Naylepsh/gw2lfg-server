import { Role } from "../../entities/role/role.entity";
import { IIdentifiableEntityRepository } from "../identifiable-entity.repository.interface";

export interface IRoleRepository extends IIdentifiableEntityRepository<Role> {}
