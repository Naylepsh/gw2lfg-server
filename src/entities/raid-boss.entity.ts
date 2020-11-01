import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RaidBoss {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  @Column()
  isCm!: boolean;

  constructor(name: string, isCm: boolean) {
    this.name = name;
    this.isCm = isCm;
  }
}
