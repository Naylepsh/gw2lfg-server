import { LIRequirement } from "../../data/entities/requirement.entity";
import { IRequirementRepository } from "../../data/repositories/requirement/requirement.repository.interface";

interface LIRequirementProps {
  quantity: number;
}

export const createAndSaveLIRequirement = (
  repository: IRequirementRepository,
  props: LIRequirementProps
) => {
  const req = new LIRequirement(props);
  return repository.save(req);
};
