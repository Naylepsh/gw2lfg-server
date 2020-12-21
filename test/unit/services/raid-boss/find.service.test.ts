import { FindRaidBossService } from "@services/raid-boss/find.service";
import { RaidBossMemoryRepository } from "../../../helpers/repositories/raid-boss.memory-repository";
import { createAndSaveRaidBoss } from "../../../helpers/raid-boss.helper";

describe("RaidBoss Service: find tests", () => {
  const bossRepo = new RaidBossMemoryRepository();
  const service = new FindRaidBossService(bossRepo);
  const numberOfPosts = 10;

  beforeEach(async () => {
    await Promise.all(
      [...Array(numberOfPosts).keys()].map((bossName) =>
        createAndSaveRaidBoss(bossRepo, {
          name: bossName.toString(),
          isCm: false,
        })
      )
    );
  });

  afterEach(async () => {
    await bossRepo.delete({});
  });

  it("should return expected number of posts if there are still more posts to find", async () => {
    const params = { skip: 0, take: numberOfPosts - 1 };

    const { bosses } = await service.find(params);

    expect(bosses.length).toBe(params.take);
  });

  it("should set hasMore to true if there are still more posts to find", async () => {
    const params = { skip: 0, take: numberOfPosts - 1 };

    const { hasMore } = await service.find(params);

    expect(hasMore).toBe(true);
  });

  it("should set hasMore to false if found all the posts", async () => {
    const params = { skip: 0, take: numberOfPosts + 1 };

    const { hasMore } = await service.find(params);

    expect(hasMore).toBe(false);
  });
});
