import { LIRequirement } from "../../../../entities/requirement.entity";
import { publish } from "../../../../services/raid-post/publish.service";
import { createAndSaveRaidBoss } from "../../../helpers/raid-boss.helper";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { createAndSaveUser } from "../../../helpers/user.helper";
import { addHours, subtractHours } from "./hours.util";

describe("RaidPost service: publish tests", () => {
  const uow = RaidPostMemoryUnitOfWork.create();

  afterEach(async () => {
    await uow.deleteAll();
  });

  it("should save a post when valid data was passed", async () => {
    const { id: userId } = await createAndSaveUser(uow.users, {
      username: "username",
    });
    const { id: bossId } = await createAndSaveRaidBoss(uow.raidBosses, {
      name: "boss",
      isCm: false,
    });
    const date = addHours(new Date(), 1);

    const { id: postId } = await publishPost(date, userId, [bossId]);
    const hasBeenSaved = !!(await uow.raidPosts.findById(postId));

    expect(hasBeenSaved).toBe(true);
  });

  it("should save requirements when valid data was passed", async () => {
    const { id: userId } = await createAndSaveUser(uow.users, {
      username: "username",
    });
    const { id: bossId } = await createAndSaveRaidBoss(uow.raidBosses, {
      name: "boss",
      isCm: false,
    });
    const date = addHours(new Date(), 1);
    const reqsInDbBefore = uow.requirements.entities.size;

    await publishPost(date, userId, [bossId]);

    const reqsInDbAfter = uow.requirements.entities.size;
    expect(reqsInDbAfter - reqsInDbBefore > 0).toBe(true);
  });

  it("should fail when a post date is in the past", async () => {
    const { id: userId } = await createAndSaveUser(uow.users, {
      username: "username",
    });
    const { id: bossId } = await createAndSaveRaidBoss(uow.raidBosses, {
      name: "boss",
      isCm: false,
    });
    const date = subtractHours(new Date(), 1);

    expect(publishPost(date, userId, [bossId])).rejects.toThrow();
  });

  async function publishPost(
    date: Date,
    authorId: number,
    bossesIds: number[]
  ) {
    const dto = {
      date,
      server: "EU",
      authorId,
      bossesIds,
      rolesProps: [],
      requirementsProps: [{ name: LIRequirement.itemName, quantity: 10 }],
    };
    return await publish(dto, uow);
  }
});
