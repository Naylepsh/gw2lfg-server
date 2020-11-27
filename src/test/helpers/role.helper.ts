import { Role } from "../../data/entities/role.entity";
import { IRoleRepository } from "../../data/repositories/role/role.repository.interface";

interface RoleProps {
  name: string;
}

export const createAndSaveRole = (
  repository: IRoleRepository,
  roleProps: RoleProps
) => {
  const role = createRole(roleProps);
  return repository.save(role);
};

export const createRole = (props: RoleProps) => {
  const role = new Role(props);
  return role;
};
