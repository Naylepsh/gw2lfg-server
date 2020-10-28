import { requirementFactory } from "../../../models/requirements/requirement.factory";
import { IRequirement } from "../../../models/requirements/requirement.interface";
import { Requirement } from "../entities/requirement.entity";

export const toPersistance = (requirement: IRequirement) => {
  const r = new Requirement();
  r.name = requirement.getName();
  r.quantity = requirement.getQuantity();

  return r;
};

export const toDomain = (requirement: Requirement) => {
  return requirementFactory.createRequirement(
    requirement.name,
    requirement.quantity
  );
};

export const requirementMap = { toPersistance, toDomain };
