import { Role } from "../../entities/role/role.entity";

export interface IRoleRepository {
  save(role: Role): Promise<Role>;
  save(roles: Role[]): Promise<Role[]>;
  findOne(params: RoleQueryParams): Promise<Role | undefined>;
  delete(criteria?: any): Promise<void>;
}

export interface RoleQueryParams {
  where?: {
    id?: number;
    name?: string;
    class?: string;
    description?: string;
  };
}
