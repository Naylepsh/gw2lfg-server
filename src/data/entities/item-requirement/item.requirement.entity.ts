import { ChildEntity, Column } from "typeorm";
import { ItemRequirementProps } from "./Item.requirement.props";
import { Requirement } from "../requirement/requirement.entity";

export interface Item {
  name: string;
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

  isSatifiedBy(item: Item) {
    const isRequiredItem = this.name === item.name;
    const hasEnough = this.quantity <= item.quantity;

    return isRequiredItem && hasEnough;
  }
}
