import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export interface RaidBossProps {
  name: string;
  isCm: boolean;
}

@Entity()
export class RaidBoss {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  @Column()
  isCm!: boolean;

  constructor(props?: RaidBossProps) {
    if (props) {
      this.name = props.name;
      this.isCm = props.isCm;
    }
  }

  equals(raidBoss: RaidBoss) {
    return this.name === raidBoss.name && this.isCm === raidBoss.isCm;
  }
}
