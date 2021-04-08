import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from "typeorm";
import { PostProps } from "./post.props";
import { Requirement } from "../requirement/requirement.entity";
import { Role } from "../role/role.entity";
import { User } from "../user/user.entity";
import {
  Item,
  ItemRequirement,
} from "../item-requirement/item.requirement.entity";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @Column()
  date: Date;

  @Column()
  server: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Requirement, (requirement) => requirement.post)
  requirements: Requirement[];

  @OneToMany(() => Role, (role) => role.post)
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(props?: PostProps) {
    if (props) {
      this.author = props.author;
      this.date = props.date;
      this.server = props.server;
      this.description = props.description;
      this.requirements = props.requirements ?? [];
      this.roles = props.roles ?? [];
    }
  }

  hasItemRequirementsSatisfiedBy(items: Item[]) {
    const itemRequirements = this.getItemRequirements();
    return itemRequirements.every((r) =>
      items.some((item) => r.isSatifiedBy(item))
    );
  }

  hasRoles() {
    return !this.isManyRelationEmpty(this.roles);
  }

  getRole(id: number) {
    if (!this.hasRoles()) {
      return undefined;
    }
    const rolesWithThatId = this.roles.filter((role) => role.id === id);
    return rolesWithThatId.length > 0 ? rolesWithThatId[0] : undefined;
  }

  private isManyRelationEmpty(relation?: any[]) {
    return relation === undefined || relation.length == 0;
  }

  hasRequirements() {
    return !this.isManyRelationEmpty(this.requirements);
  }

  getItemRequirements() {
    return (this.requirements ?? []).filter(
      (req) => req instanceof ItemRequirement
    ) as ItemRequirement[];
  }
}
