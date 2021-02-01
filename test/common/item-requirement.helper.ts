import { ItemRequirement } from "@root/data/entities/item-requirement/item.requirement.entity";
import { ItemRequirementProps } from "@root/data/entities/item-requirement/Item.requirement.props";
import { IRequirementRepository } from "@data/repositories/requirement/requirement.repository.interface";


export const createAndSaveItemRequirement = (
  repository: IRequirementRepository,
  props: ItemRequirementProps
) => {
  const req = new ItemRequirement(props);
  return repository.save(req);
};
