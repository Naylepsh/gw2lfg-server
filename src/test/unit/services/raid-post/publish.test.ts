import { LIRequirement } from "../../../../entities/requirement.entity";
import { publish } from "../../../../services/raid-post/publish";
import { createAndSaveRaidBoss } from "../../../helpers/raid-boss.helper";
import { RaidBossMemoryRepository } from "../../../helpers/repositories/raid-boss.memory-repository";
import { RaidPostMemoryRepository } from "../../../helpers/repositories/raid-post.memory-repository";
import { RequirementMemoryRepository } from "../../../helpers/repositories/requirement.memory-repository";
import { RoleMemoryRepository } from "../../../helpers/repositories/role.memory-repository";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { createAndSaveUser } from "../../../helpers/user.helper";

const addHours = (date: Date, hours: number) => {
  const copy = new Date(date);
  copy.setTime(copy.getTime() + hours * 60 * 60 * 1000);
  return copy;
};

const subtractHours = (date: Date, hours: number) => {
  return addHours(date, -hours);
};

describe("RaidPost service: publish tests", () => {
  const uow = new RaidPostMemoryUnitOfWork(
    new UserMemoryRepository(),
    new RaidBossMemoryRepository(),
    new RoleMemoryRepository(),
    new RequirementMemoryRepository(),
    new RaidPostMemoryRepository()
  );

  afterEach(async () => {
    await uow.raidPosts.delete({});
    await uow.users.delete({});
    await uow.requirements.delete({});
    await uow.roles.delete({});
    await uow.raidBosses.delete({});
  });

  it("should save a post when valid data was passed", async () => {
    const { id: userId } = await addUser({ username: "username" });
    const { id: bossId } = await addRaidBoss({
      name: "boss",
      isCm: false,
    });
    const date = addHours(new Date(), 1);

    const { id: postId } = await publishPost(date, userId, [bossId]);
    const hasBeenSaved = !!(await uow.raidPosts.findById(postId));

    expect(hasBeenSaved).toBe(true);
  });

  it("should save requirements when valid data was passed", async () => {
    const { id: userId } = await addUser({ username: "username" });
    const { id: bossId } = await addRaidBoss({
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
    const { id: userId } = await addUser({ username: "username" });
    const { id: bossId } = await addRaidBoss({
      name: "boss",
      isCm: false,
    });
    const date = subtractHours(new Date(), 1);

    expect(publishPost(date, userId, [bossId])).rejects.toThrow();
  });

  function addUser(user: { username: string }): Promise<{ id: any }> {
    return createAndSaveUser(uow.users, user);
  }

  function addRaidBoss(raidBoss: {
    name: string;
    isCm: boolean;
  }): Promise<{ id: any }> {
    return createAndSaveRaidBoss(uow.raidBosses, raidBoss);
  }

  function publishPost(date: Date, authorId: number, bossesIds: number[]) {
    const dto = {
      raidPostProps: {
        date,
        server: "EU",
      },
      authorId,
      bossesIds,
      rolesProps: [],
      requirementsProps: [{ name: LIRequirement.itemName, quantity: 10 }],
    };
    return publish(dto, uow);
  }
});
