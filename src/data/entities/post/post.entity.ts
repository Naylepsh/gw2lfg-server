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

  hasRequirements() {
    return !this.isManyRelationEmpty(this.requirements);
  }

  hasRole(roleId: number) {
    return (
      this.hasRoles() &&
      this.roles.filter((role) => role.id === roleId).length === 1
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
}
