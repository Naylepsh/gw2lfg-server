import { Get, JsonController, QueryParams } from "routing-controllers";
import { FindRaidBossesService } from "../../../services/raid-boss/find-raid-bosses.service";
import { FindRaidBossesQueryParams } from "./find-raid-bosses.query-params";
import { FindRaidBossesResponse } from "./find-raid-bosses.response";

@JsonController()
export class FindRaidBossesController {
  constructor(private readonly findService: FindRaidBossesService) {}

  @Get("/raid-bosses")
  async findAll(
    @QueryParams() query: FindRaidBossesQueryParams
  ): Promise<FindRaidBossesResponse> {
    const { bosses, hasMore } = await this.findService.find(query);
    return { data: bosses, hasMore };
  }
}
