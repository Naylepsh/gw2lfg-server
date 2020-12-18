import { RaidBoss } from "@data/entities/raid-boss.entity";
import { IRaidBossRepository } from "@data/repositories/raid-boss/raid-boss.repository.interface";

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
