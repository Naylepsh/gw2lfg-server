import { Role } from "../../entities/role.entity";
import { IRoleRepository } from "../../repositories/role.repository";

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
