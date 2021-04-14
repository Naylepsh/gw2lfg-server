import { RoleProps } from "@data/entities/role/role.props";

export type RolePropsDTO = { id?: number } & Omit<RoleProps, "post">;
