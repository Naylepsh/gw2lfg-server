import { LIRequirement } from "../../../../data/entities/requirement.entity";
import {
  PublishRaidPostService,
  PublishDTO,
} from "../../../../services/raid-post/publish.service";
import { createAndSaveRaidBoss } from "../../../helpers/raid-boss.helper";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { createAndSaveUser } from "../../../helpers/user.helper";
import { addHours, subtractHours } from "./hours.util";

describe("RaidPost service: publish tests", () => {
  const uow = RaidPostMemoryUnitOfWork.create();
  const publishService = new PublishRaidPostService(uow);

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
    const { id: postId } = await publishService.publish(dto);

    const hasBeenSaved = !!(await uow.raidPosts.findById(postId));

    expect(hasBeenSaved).toBe(true);
  });

  it("should save requirements when valid data was passed", async () => {
    const { id: userId } = await createAndSaveUser(uow.users, {
      username: "username",
    });
    const date = addHours(new Date(), 1);
    const dto = createPublishDto(userId, [], {
      date,
      requirementsProps: [{ name: LIRequirement.itemName, quantity: 10 }],
    });
    const reqsInDbBefore = uow.requirements.entities.length;

    await publishService.publish(dto);

    const reqsInDbAfter = uow.requirements.entities.length;
    expect(reqsInDbAfter - reqsInDbBefore > 0).toBe(true);
  });

  it("should save roles when valid data was passed", async () => {
    const { id: userId } = await createAndSaveUser(uow.users, {
      username: "username",
    });
    const date = addHours(new Date(), 1);
    const dto = createPublishDto(userId, [], {
      date,
      rolesProps: [{ name: "DPS", class: "Any" }],
    });
    const rolesInDbBefore = uow.roles.entities.length;

    await publishService.publish(dto);

    const rolesInDbAfter = uow.roles.entities.length;
    expect(rolesInDbAfter - rolesInDbBefore > 0).toBe(true);
  });

  it("should NOT create additional users", async () => {
    const { id: userId } = await createAndSaveUser(uow.users, {
      username: "username",
    });
    const date = addHours(new Date(), 1);
    const dto = createPublishDto(userId, [], {
      date,
    });
    const usersInDbBefore = uow.users.entities.length;

    await publishService.publish(dto);

    const usersInDbAfter = uow.users.entities.length;
    expect(usersInDbAfter).toBe(usersInDbBefore);
  });

  it("should NOT create additional bosses", async () => {
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
    });
    const bossesInDbBefore = uow.raidBosses.entities.length;

    await publishService.publish(dto);

    const bossesInDbAfter = uow.raidBosses.entities.length;
    expect(bossesInDbAfter).toBe(bossesInDbBefore);
  });

  it("should fail when a post date is in the past", async () => {
    const { id: userId } = await createAndSaveUser(uow.users, {
      username: "username",
    });
    const date = subtractHours(new Date(), 1);
    const dto = createPublishDto(userId, [], { date });

    expect(publishService.publish(dto)).rejects.toThrow();
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
      rolesProps: dto.rolesProps ?? [],
      requirementsProps: dto.requirementsProps ?? [],
    };
  }
});
