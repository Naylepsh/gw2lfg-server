import { LIRequirement } from "./li-requirement.model";
import { IRequirement } from "./requirement.interface";

interface IRequirementFactoryWorker {
  acceptsParameters(name: string): boolean;
  createRequirement(quantity: number): IRequirement;
}

class LiRequirementWorker implements IRequirementFactoryWorker {
  acceptsParameters(name: string): boolean {
    return name === LIRequirement.itemName;
  }

  createRequirement(quantity: number): IRequirement {
    return new LIRequirement(quantity);
  }
}

class UnregisteredWorkerError extends Error {}

export class RequirementFactory {
  constructor(private workers: IRequirementFactoryWorker[]) {}

  createRequirement(name: string, quantity: number = 1) {
    for (const worker of this.workers) {
      if (worker.acceptsParameters(name))
        return worker.createRequirement(quantity);
    }

    throw new UnregisteredWorkerError();
  }
}

const registeredWorkers = [new LiRequirementWorker()];
export const requirementFactory = new RequirementFactory(registeredWorkers);
