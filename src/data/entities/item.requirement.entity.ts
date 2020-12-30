import {
  ChildEntity,
  Column
} from "typeorm";
import { RequirementProps, Requirement } from "./requirement.entity";


export interface ItemRequirementProps extends RequirementProps {
  quantity: number;
}

@ChildEntity()
export class ItemRequirement extends Requirement {
  @Column({ type: "int" })
  quantity: number;

  constructor(props?: ItemRequirementProps) {
    super(props);
    if (props) {
      this.quantity = props.quantity;
    }
  }
}
