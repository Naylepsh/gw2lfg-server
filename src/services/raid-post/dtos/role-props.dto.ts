import { RoleProps } from "../../../data/entities/role/role.props";

export type RolePropsDTO = Omit<RoleProps, "post">;
