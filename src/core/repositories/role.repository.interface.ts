import { Role } from "../entities/role.entity";
import { IIdentifiableEntityRepository } from "./repository.interface";

export interface IRoleRepository extends IIdentifiableEntityRepository<Role> {}
