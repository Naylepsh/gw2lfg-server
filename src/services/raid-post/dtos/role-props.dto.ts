import { RoleProps } from "../../../data/entities/role.entity";

export type RolePropsDTO = Omit<RoleProps, "post">;
