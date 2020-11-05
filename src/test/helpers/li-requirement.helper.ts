import { LIRequirement } from "../../entities/requirement.entity";
import { IRequirementRepository } from "../../repositories/requirement.repository";

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
