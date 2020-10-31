import { requirementFactory } from "../../../models/requirements/requirement.factory";
import { IRequirement } from "../../../models/requirements/requirement.interface";
import { Requirement } from "../entities/requirement.entity";
import { Mapper } from "./map.type";

export const toPersistence: Mapper<IRequirement, Requirement> = (
  requirement: IRequirement
) => {
  const r = new Requirement();
  r.name = requirement.getName();
  r.quantity = requirement.getQuantity();

  return r;
};

export const toDomain: Mapper<Requirement, IRequirement> = (
  requirement: Requirement
) => {
  return requirementFactory.createRequirement(
    requirement.name,
    requirement.quantity
  );
};

export const requirementMap = { toPersistence, toDomain };
