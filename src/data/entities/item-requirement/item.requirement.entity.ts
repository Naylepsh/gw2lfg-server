import { ChildEntity, Column } from "typeorm";
import { ItemRequirementProps } from "./Item.requirement.props";
import { Requirement } from "../requirement/requirement.entity";

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
