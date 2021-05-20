import { Inject, Service } from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import {
  findRaidClearStatusServiceType,
  userRepositoryType,
} from "@loaders/typedi.constants";
import { UserNotFoundError } from "../common/errors/entity-not-found.error";
import { FindUserDTO } from "./dtos/find-user.dto";
import { raids } from "@data/entities/raid-boss/gw2-raids.json";
import { IFindRaidClearStatusService } from "../gw2-api/raids/find-raid-clear-status.gw2-api.service";
import { byId } from "@root/data/queries/common.queries";

/**
 * Service for finding a user with matching id and getting his item stats from GW2 API
 */
@Service()
export class FindUserRaidClearStatusService {
  constructor(
    @Inject(userRepositoryType)
    private readonly userRepository: IUserRepository,
    @Inject(findRaidClearStatusServiceType)
    private readonly findRaidClearStatusService: IFindRaidClearStatusService
  ) {}

  async find(dto: FindUserDTO) {
    const user = await this.userRepository.findOne(byId(dto.id));
    if (!user) {
      throw new UserNotFoundError();
    }

    // get all bosses names used by this server
    const encounters = raids.map((raid) => raid.encounters).flat();
    const bosses = encounters.map((encounter) => encounter.name);

    const clearedRaids = await this.findRaidClearStatusService.findClearedRaids(
      user.apiKey
    );

    const clearedBosses = bosses.filter((boss) => {
      return clearedRaids.includes(boss.toLowerCase().replace(" ", "_"));
    });

    return clearedBosses;
  }
}
