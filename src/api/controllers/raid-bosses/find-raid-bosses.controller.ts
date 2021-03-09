import { Get, JsonController } from "routing-controllers";
import { FindRaidBossesService } from "../../../services/raid-boss/find-raid-bosses.service";
import { FindRaidBossesResponse } from "./find-raid-bosses.response";

/**
 * Controller for GET /raid-bosses requests.
 * Returns all bosses from the database.
 */
@JsonController()
export class FindRaidBossesController {
  constructor(private readonly findService: FindRaidBossesService) {}

  @Get("/raid-bosses")
  async findAll(): Promise<FindRaidBossesResponse> {
    const bosses = await this.findService.find();

    return { data: bosses };
  }
}
