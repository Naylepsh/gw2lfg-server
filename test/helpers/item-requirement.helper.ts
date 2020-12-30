import { ItemRequirement } from "@data/entities/item.requirement.entity";
import { ItemRequirementProps } from "@root/data/entities/Item.requirement.props";
import { IRequirementRepository } from "@data/repositories/requirement/requirement.repository.interface";


export const createAndSaveItemRequirement = (
  repository: IRequirementRepository,
  props: ItemRequirementProps
) => {
  const req = new ItemRequirement(props);
  return repository.save(req);
};
