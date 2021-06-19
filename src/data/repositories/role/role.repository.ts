import { Service } from "typedi";
import { AbstractRepository, EntityRepository } from "typeorm";
import { Role } from "../../entities/role/role.entity";
import { IRoleRepository, RoleQueryParams } from "./role.repository.interface";

@Service()
@EntityRepository(Role)
export class RoleRepository
  extends AbstractRepository<Role>
  implements IRoleRepository
{
  save(role: Role): Promise<Role>;
  save(roles: Role[]): Promise<Role[]>;
  save(roles: any): Promise<Role> | Promise<Role[]> {
    return this.repository.save(roles);
  }

  findOne(params: RoleQueryParams): Promise<Role | undefined> {
    return this.repository.findOne(params);
  }

  async delete(params: RoleQueryParams): Promise<void> {
    await this.repository.delete(params.where ?? {});
  }
}
