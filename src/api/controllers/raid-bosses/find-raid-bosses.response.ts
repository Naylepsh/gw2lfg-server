import { IRouteResponse } from "../../responses/route.response.interface";
import { RaidBoss } from "../../../data/entities/raid-boss/raid-boss.entity";

export interface FindRaidBossesResponse extends IRouteResponse<RaidBoss[]> {}
