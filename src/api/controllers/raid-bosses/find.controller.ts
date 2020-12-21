import { IsOptional, IsPositive, Min } from "class-validator";
import { Get, JsonController, QueryParams } from "routing-controllers";
import { IRouteResponse } from "../../responses/routes/route.response.interface";
import { RaidBoss } from "../../../data/entities/raid-boss.entity";
import { FindRaidBossService } from "../../../services/raid-boss/find.service";

class FindRaidBossesQueryParams {
  @IsOptional()
  @IsPositive()
  take: number = 10;

  @IsOptional()
  @Min(0)
  skip: number = 0;
}

interface FindRaidBossesResponse extends IRouteResponse<RaidBoss[]> {
  hasMore: boolean;
}

@JsonController()
export class FindRaidBossesController {
  constructor(private readonly findService: FindRaidBossService) {}

  @Get("/raid-bosses")
  async findAll(
    @QueryParams() query: FindRaidBossesQueryParams
  ): Promise<FindRaidBossesResponse> {
    const { bosses, hasMore } = await this.findService.find(query);
    return { data: bosses, hasMore };
  }
}
