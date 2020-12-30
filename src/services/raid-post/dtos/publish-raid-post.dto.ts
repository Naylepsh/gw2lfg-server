import { RolePropsDTO } from "./role-props.dto";
import { RequirementsPropsDTO } from "./requirements-props.dto";

export interface PublishRaidPostDTO {
  date: Date;
  server: string;
  description?: string;
  authorId: number;
  bossesIds: number[];
  rolesProps: RolePropsDTO[];
  requirementsProps: RequirementsPropsDTO;
}
