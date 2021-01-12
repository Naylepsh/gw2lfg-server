import { Inject, Service } from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import {
  findUserItemsServiceType,
  getItemsFromEntireAccountFetcherType,
  userRepositoryType,
} from "@loaders/typedi.constants";
import { UserNotFoundError } from "../common/errors/entity-not-found.error";
import { FindUserDTO } from "./dtos/find-user.dto";
import { ItemsFetcher } from "../gw2-api/items/get-items.gw2-api.service";
import items from "../gw2-items/items.json";
import { idToName } from "../gw2-items/gw2-items.service";

/*
Service for finding a user with matching id and getting his item stats from GW2 API
*/
@Service(findUserItemsServiceType)
export class FindUserItemsService {
  constructor(
    @Inject(userRepositoryType)
    private readonly userRepository: IUserRepository,
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

    const countedItems = await this.itemsFetcher.fetch(itemIds, user.apiKey);

    return countedItems.map(({ id, count }) => ({
      name: idToName(id),
      quantity: count,
    }));
  }
}
