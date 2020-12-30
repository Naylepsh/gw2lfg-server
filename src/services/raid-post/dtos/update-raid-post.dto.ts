import { RolePropsDTO } from "./role-props.dto";
import { RequirementsPropsDTO } from "./requirements-props.dto";

export interface UpdateRaidPostDTO {
  id: number;
  date: Date;
  server: string;
  description?: string;
  bossesIds: number[];
  rolesProps: RolePropsDTO[];
  requirementsProps: RequirementsPropsDTO;
}
