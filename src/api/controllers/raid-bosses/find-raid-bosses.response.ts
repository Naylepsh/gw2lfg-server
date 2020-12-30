import { IRouteResponse } from "../../responses/routes/route.response.interface";
import { RaidBoss } from "../../../data/entities/raid-boss.entity";

export interface FindRaidBossesResponse extends IRouteResponse<RaidBoss[]> {
  hasMore: boolean;
}
