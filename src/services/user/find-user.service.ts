import { Inject, Service } from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import {
  findAccountServiceType,
  getItemsFromEntireAccountFetcherType,
  userRepositoryType,
} from "@loaders/typedi.constants";
import { UserNotFoundError } from "../common/errors/entity-not-found.error";
import { AccountFetcher } from "../gw2-api/account/find-account.gw2-api.service";
import { FindUserDTO } from "./dtos/find-user.dto";
import { ItemsFetcher } from "../gw2-api/items/get-items.gw2-api.service";
import items from "../gw2-items/items.json";
import { idToName } from "../gw2-items/gw2-items.service";

/*
Service for finding a user with matching id and attaching various data from GW2 account using their API key
*/
@Service()
export class FindUserService {
  constructor(
    @Inject(userRepositoryType)
    private readonly userRepository: IUserRepository,
    @Inject(findAccountServiceType)
    private readonly accountFetcher: AccountFetcher,
    @Inject(getItemsFromEntireAccountFetcherType)
    private readonly itemsFetcher: ItemsFetcher
  ) {}

  async find(dto: FindUserDTO) {
    const user = await this.userRepository.findById(dto.id);
    if (!user) {
      throw new UserNotFoundError();
    }

    // get all items usable by this server
    const itemIds = Object.values(items);

    const [account, countedItems] = await Promise.all([
      await this.accountFetcher.fetch(user.apiKey),
      await this.itemsFetcher.fetch(itemIds, user.apiKey),
    ]);

    return {
      user,
      account,
      items: countedItems.map(({ id, count }) => ({
        name: idToName(id),
        quantity: count,
      })),
    };
  }
}
