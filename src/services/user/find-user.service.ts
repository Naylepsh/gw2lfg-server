import { Inject, Service } from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import {
  findAccountServiceType,
  userRepositoryType,
} from "@loaders/typedi.constants";
import { UserNotFoundError } from "../common/errors/entity-not-found.error";
import { AccountFetcher } from "../gw2-api/account/find-account.gw2-api.service";
import { FindUserDTO } from "./dtos/find-user.dto";

/*
Service for finding a user with matching id and attaching various data from GW2 account using their API key
*/
@Service()
export class FindUserService {
  constructor(
    @Inject(userRepositoryType)
    private readonly userRepository: IUserRepository,
    @Inject(findAccountServiceType)
    private readonly accountFetcher: AccountFetcher
  ) {}

  async find(dto: FindUserDTO) {
    const user = await this.userRepository.findById(dto.id);
    if (!user) {
      throw new UserNotFoundError();
    }

    const account = await this.accountFetcher.fetch(user.apiKey);

    return {
      user,
      account,
    };
  }
}
