import {
  LIRequirement,
  Requirement,
} from "../../../../entities/requirement.entity";
import { IRequirementRepository } from "../../../../repositories/requirement.repository";

export type CreateAndSaveLIRequirement = (
  quantity: number
) => Promise<Requirement>;

export const createAndSaveLIRequirementWithRepository = (
  repository: IRequirementRepository
): CreateAndSaveLIRequirement => (quantity: number) => {
  const req = new LIRequirement(quantity);
  return repository.save(req);
};
