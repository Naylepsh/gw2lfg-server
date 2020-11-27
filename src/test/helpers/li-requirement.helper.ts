import { LIRequirement } from "../../core/entities/requirement.entity";
import { IRequirementRepository } from "../../core/repositories/requirement.repository.interface";

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
