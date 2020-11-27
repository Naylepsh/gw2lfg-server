import { RaidBoss } from "../../core/entities/raid-boss.entity";
import { IRaidBossRepository } from "../../core/repositories/raid-boss.repository.interface";

interface RaidBossProps {
  name: string;
  isCm: boolean;
}

export const createAndSaveRaidBoss = (
  repository: IRaidBossRepository,
  raidBossProps: RaidBossProps
) => {
  const author = createRaidBoss(raidBossProps);
  return repository.save(author);
};

export const createRaidBoss = (props: RaidBossProps) => {
  const author = new RaidBoss(props);
  return author;
};
