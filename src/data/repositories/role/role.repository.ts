import { Service } from "typedi";
import { AbstractRepository, EntityRepository } from "typeorm";
import { Role } from "../../entities/role/role.entity";
import { IRoleRepository, RoleQueryParams } from "./role.repository.interface";

@Service()
@EntityRepository(Role)
export class RoleRepository
  extends AbstractRepository<Role>
  implements IRoleRepository {
  save(role: Role): Promise<Role>;
  save(roles: Role[]): Promise<Role[]>;
  save(data: Role | Role[]): Promise<Role | Role[]> {
    if (Array.isArray(data)) {
      return this.repository.save(data);
    }
    return this.repository.save(data);
  }

  findOne(params: RoleQueryParams): Promise<Role | undefined> {
    return this.repository.findOne(params);
  }

  async delete(criteria: any = {}): Promise<void> {
    await this.repository.delete(criteria);
  }
}
