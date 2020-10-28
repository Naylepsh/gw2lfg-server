import { IPosition } from "./position.interface";

export class RaidPosition implements IPosition {
  constructor(
    public readonly type: string,
    public readonly description: string,
    public readonly specialization: string,
    public readonly characterClass: string
  ) {}
}
