import { LIRequirement } from "../../../../entities/requirement.entity";
import {
  publish,
  PublishDTO,
} from "../../../../services/raid-post/publish.service";
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
    const dto = createPublishDto(userId, [bossId], { date });
    const { id: postId } = await publish(dto, uow);

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
    const dto = createPublishDto(userId, [bossId], {
      date,
      requirementsProps: [{ name: LIRequirement.itemName, quantity: 10 }],
    });
    const reqsInDbBefore = uow.requirements.entities.size;

    await publish(dto, uow);

    const reqsInDbAfter = uow.requirements.entities.size;
    expect(reqsInDbAfter - reqsInDbBefore > 0).toBe(true);
  });

  it("should save roles when valid data was passed", async () => {
    const { id: userId } = await createAndSaveUser(uow.users, {
      username: "username",
    });
    const { id: bossId } = await createAndSaveRaidBoss(uow.raidBosses, {
      name: "boss",
      isCm: false,
    });
    const date = addHours(new Date(), 1);
    const dto = createPublishDto(userId, [bossId], {
      date,
      rolesProps: [{ name: "DPS" }],
    });
    const rolesInDbBefore = uow.roles.entities.size;

    await publish(dto, uow);

    const rolesInDbAfter = uow.requirements.entities.size;
    expect(rolesInDbAfter - rolesInDbBefore > 0).toBe(true);
  });

  // it('should NOT create additional users')
  // it('should NOT create additional bosses')

  it("should fail when a post date is in the past", async () => {
    const { id: userId } = await createAndSaveUser(uow.users, {
      username: "username",
    });
    const { id: bossId } = await createAndSaveRaidBoss(uow.raidBosses, {
      name: "boss",
      isCm: false,
    });
    const date = subtractHours(new Date(), 1);
    const dto = createPublishDto(userId, [bossId], { date });

    expect(publish(dto, uow)).rejects.toThrow();
  });

  function createPublishDto(
    authorId: number,
    bossesIds: number[],
    dto: Partial<PublishDTO>
  ) {
    return {
      date: dto.date ?? addHours(new Date(), 1),
      server: dto.server ?? "EU",
      authorId,
      bossesIds,
      rolesProps: [{ name: "DPS" }],
      requirementsProps: [{ name: LIRequirement.itemName, quantity: 10 }],
    };
  }
});
