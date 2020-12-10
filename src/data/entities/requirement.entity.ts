import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./post.entity";

export interface RequirementProps {
  name: string;
}

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class Requirement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  @ManyToOne(() => Post, (post) => post.requirements)
  post: Post;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(props?: RequirementProps) {
    if (props) {
      this.name = props.name;
    }
  }
}

export interface ItemRequirementProps extends RequirementProps {
  quantity: number;
}

@ChildEntity()
export abstract class ItemRequirement extends Requirement {
  @Column({ type: "int" })
  quantity: number;

  constructor(props?: ItemRequirementProps) {
    super(props);
    if (props) {
      this.quantity = props.quantity;
    }
  }
}

export interface LIRequirementProps {
  quantity: number;
}

@ChildEntity()
export class LIRequirement extends ItemRequirement {
  public static itemName = "Legendary Insight";

  constructor(props?: LIRequirementProps) {
    if (props) {
      super({ ...props, name: LIRequirement.itemName });
    } else {
      super();
    }
  }
}
