import { Role } from "../../entities/role/role.entity";
import { IIdentifiableEntityRepository } from "../repository.interface";

export interface IRoleRepository extends IIdentifiableEntityRepository<Role> {}
