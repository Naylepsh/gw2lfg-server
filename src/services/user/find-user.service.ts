import { Inject, Service } from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { types } from "@loaders/typedi.constants";
import { UserNotFoundError } from "../common/errors/entity-not-found.error";
import { IFindAccountService } from "../gw2-api/account/find-account.gw2-api.service";
import { FindUserDTO } from "./dtos/find-user.dto";
import { byId } from "@root/data/queries/common.queries";

/**
 * Service for finding a user with matching id and attaching various data from GW2 account using their API key
 */
@Service()
export class FindUserService {
  constructor(
    @Inject(types.repositories.user)
    private readonly userRepository: IUserRepository,
    @Inject(types.services.findAccount)
    private readonly accountFetcher: IFindAccountService
  ) {}

  async find(dto: FindUserDTO) {
    const user = await this.userRepository.findOne(byId(dto.id));
    if (!user) {
      throw new UserNotFoundError();
    }

    const account = await this.accountFetcher.findAccount(user.apiKey);

    return {
      user,
      account,
    };
  }
}
