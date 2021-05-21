import { Inject, Service } from "typedi";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { Item } from "@data/entities/item-requirement/item.requirement.entity";
import {
  findUserItemsServiceType,
  getItemsFromEntireAccountFetcherType,
  userRepositoryType,
} from "@loaders/typedi.constants";
import { UserNotFoundError } from "../common/errors/entity-not-found.error";
import { FindUserDTO } from "./dtos/find-user.dto";
import { ItemsFetcher } from "../gw2-api/items/items-fetcher.interface";
import items from "../gw2-api/items/items.json";
import { byId } from "@root/data/queries/common.queries";
import { idToName } from "../gw2-api/items/item.utils";

/**
 * Service for finding a user with matching id and getting his item stats from GW2 API
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
    const user = await this.userRepository.findOne(byId(dto.id));
    if (!user) {
      throw new UserNotFoundError();
    }

    // get all items usable by this server
    const itemIds = Object.values(items);

    const countedItems = await this.itemsFetcher.fetch(itemIds, user.apiKey);

    return countedItems.map(({ id, count }) => ({
      name: idToName(id),
      quantity: count,
    })) as Item[];
  }
}
