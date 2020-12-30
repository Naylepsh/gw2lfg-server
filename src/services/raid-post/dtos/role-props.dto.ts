import { RoleProps } from "../../../data/entities/role.props";

export type RolePropsDTO = Omit<RoleProps, "post">;
