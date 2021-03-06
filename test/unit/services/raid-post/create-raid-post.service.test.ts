import { CreateRaidPostService } from "@root/services/raid-post/create-raid-post.service";
import { CreateRaidPostDTO } from "@root/services/raid-post/dtos/create-raid-post.dto";
import { createAndSaveRaidBoss } from "../../../common/raid-boss.helper";
import { RaidPostMemoryUnitOfWork } from "../../../common/uows/raid-post.memory-unit-of-work";
import { createAndSaveUser } from "../../../common/user.helper";
import { addHours, subtractHours } from "../../../common/hours.util";
import { NotificationMemoryRepository } from "../../../common/repositories/notification.memory-repository";
import { CreateNotificationService } from "@services/notification/create-notification.service";

describe("CreateRaidPost service tests", () => {
  const uow = RaidPostMemoryUnitOfWork.create();
  const notificationRepo = new NotificationMemoryRepository();
  const publishService = new CreateRaidPostService(
    uow,
    uow.users,
    new CreateNotificationService(notificationRepo)
  );
  const defaultProps = {
    bossesIds: [1],
    rolesProps: [{ name: "dps", class: "warrior" }],
  };

  afterEach(async () => {
    await uow.deleteAll();
    await notificationRepo.delete({});
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
    const dto = createDto(userId, {
      ...defaultProps,
      bossesIds: [bossId],
      date,
    });
    const { id: postId } = await publishService.create(dto);

    const hasBeenSaved = !!(await uow.raidPosts.findOne({
      where: { id: postId },
    }));

    expect(hasBeenSaved).toBe(true);
  });

  it("should save requirements when valid data was passed", async () => {
    const { id: userId } = await createAndSaveUser(uow.users, {
      username: "username",
    });
    const date = addHours(new Date(), 1);
    const dto = createDto(userId, {
      ...defaultProps,
      date,
      requirementsProps: { itemsProps: [{ name: "Some Item", quantity: 10 }] },
    });
    const reqsInDbBefore = uow.itemRequirements.entities.length;

    await publishService.create(dto);

    const reqsInDbAfter = uow.itemRequirements.entities.length;
    expect(reqsInDbAfter - reqsInDbBefore > 0).toBe(true);
  });

  it("should save roles when valid data was passed", async () => {
    const { id: userId } = await createAndSaveUser(uow.users, {
      username: "username",
    });
    const date = addHours(new Date(), 1);
    const dto = createDto(userId, {
      ...defaultProps,
      date,
      rolesProps: [{ name: "DPS", class: "Any" }],
    });
    const rolesInDbBefore = uow.roles.entities.length;

    await publishService.create(dto);

    const rolesInDbAfter = uow.roles.entities.length;
    expect(rolesInDbAfter - rolesInDbBefore > 0).toBe(true);
  });

  it("should NOT create additional users", async () => {
    const { id: userId } = await createAndSaveUser(uow.users, {
      username: "username",
    });
    const date = addHours(new Date(), 1);
    const dto = createDto(userId, {
      ...defaultProps,
      date,
    });
    const usersInDbBefore = uow.users.entities.length;

    await publishService.create(dto);

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
    const dto = createDto(userId, {
      ...defaultProps,
      bossesIds: [bossId],
      date,
    });
    const bossesInDbBefore = uow.raidBosses.entities.length;

    await publishService.create(dto);

    const bossesInDbAfter = uow.raidBosses.entities.length;
    expect(bossesInDbAfter).toBe(bossesInDbBefore);
  });

  it("should fail when a post date is in the past", async () => {
    const { id: userId } = await createAndSaveUser(uow.users, {
      username: "username",
    });
    const date = subtractHours(new Date(), 1);
    const dto = createDto(userId, { date });

    expect(publishService.create(dto)).rejects.toThrow();
  });

  function createDto(authorId: number, dto: Partial<CreateRaidPostDTO>) {
    return {
      date: dto.date ?? addHours(new Date(), 1),
      server: dto.server ?? "EU",
      authorId,
      bossesIds: dto.bossesIds ?? [],
      rolesProps: dto.rolesProps ?? [],
      requirementsProps: dto.requirementsProps ?? { itemsProps: [] },
    };
  }
});
