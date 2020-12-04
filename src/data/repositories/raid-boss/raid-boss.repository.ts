import { Service } from "typedi";
import { EntityRepository } from "typeorm";
import { RaidBoss } from "../../entities/raid-boss.entity";
import { IdentifiableEntityRepository } from "../generic.repository";
import { IRaidBossRepository } from "./raid-boss.repository.interface";

@Service()
@EntityRepository(RaidBoss)
export class RaidBossRepository
  extends IdentifiableEntityRepository<RaidBoss>
  implements IRaidBossRepository {}
