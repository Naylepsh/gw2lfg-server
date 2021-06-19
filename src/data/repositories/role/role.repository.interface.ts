import { FindOperator } from "typeorm";
import { Role } from "../../entities/role/role.entity";

export interface IRoleRepository {
  save(role: Role): Promise<Role>;
  save(roles: Role[]): Promise<Role[]>;
  findOne(params: RoleQueryParams): Promise<Role | undefined>;
  delete(params: RoleQueryParams): Promise<void>;
}

export interface RoleQueryParams {
  where?: {
    id?: number | FindOperator<number>;
    name?: string;
    class?: string;
    description?: string;
    post?: {
      id: number | FindOperator<number>;
    };
  };
}
