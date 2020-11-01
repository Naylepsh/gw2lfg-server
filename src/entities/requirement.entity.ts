import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from "typeorm";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class Requirement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(name: string) {
    this.name = name;
  }
}

@ChildEntity()
export abstract class ItemRequirement extends Requirement {
  @Column({ type: "int" })
  quantity!: number;

  constructor(name: string, quantity: number) {
    super(name);
    this.quantity = quantity;
  }
}

@ChildEntity()
export class LIRequirement extends ItemRequirement {
  constructor(quantity: number) {
    super("Legendary Insight", quantity);
  }
}
