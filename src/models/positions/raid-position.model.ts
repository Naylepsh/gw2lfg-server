import { IPosition } from "./position.interface";

export class RaidPosition implements IPosition {
  type: string;
  description: string;
  class: string;
  specialization: string;
}
