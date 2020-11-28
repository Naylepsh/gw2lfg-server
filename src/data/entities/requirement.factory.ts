import { LIRequirement, Requirement } from "./requirement.entity";

export interface RequirementArgs {
  name: string;
  quantity?: number;
}

interface IRequirementFactoryWorker {
  acceptsParameters(args: RequirementArgs): boolean;
  createRequirement(args: RequirementArgs): Requirement;
}

class LiRequirementWorker implements IRequirementFactoryWorker {
  acceptsParameters(args: RequirementArgs): boolean {
    return args.name === LIRequirement.itemName && args.quantity !== undefined;
  }

  createRequirement(args: RequirementArgs): Requirement {
    return new LIRequirement({ quantity: args.quantity! });
  }
}

class UnregisteredWorkerError extends Error {}

export class RequirementFactory {
  constructor(private workers: IRequirementFactoryWorker[]) {}

  createRequirement(args: RequirementArgs) {
    for (const worker of this.workers) {
      if (worker.acceptsParameters(args)) return worker.createRequirement(args);
    }

    throw new UnregisteredWorkerError();
  }
}

const registeredWorkers = [new LiRequirementWorker()];
export const requirementFactory = new RequirementFactory(registeredWorkers);
