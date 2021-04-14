import { UpdateRaidPostService } from "@services/raid-post/update-raid-post.service";
import { UpdateRaidPostDTO } from "@services/raid-post/dtos/update-raid-post.dto";
import { createAndSaveItemRequirement } from "../../../common/item-requirement.helper";
import { createAndSaveRaidBoss } from "../../../common/raid-boss.helper";
import { createAndSaveRaidPost } from "../../../common/raid-post.helper";
import { RaidPostMemoryUnitOfWork } from "../../../common/uows/raid-post.memory-unit-of-work";
import { createAndSaveUser } from "../../../common/user.helper";
import { addHours, subtractHours } from "../../../common/hours.util";

describe("RaidPost Service: update tests", () => {
  const uow = RaidPostMemoryUnitOfWork.create();
  const service = new UpdateRaidPostService(uow);

  afterEach(async () => {
    await uow.deleteAll();
  });

  it("should update a post when valid data was passed", async () => {
    const user = await createAndSaveUser(uow.users, { username: "username" });
    const raidPost = await createAndSaveRaidPost(uow.raidPosts, user, {
      date: addHours(new Date(), 1),
    });
    const updateDto = createUpdateDto(raidPost.id, { server: "NA" });

    await service.update(updateDto);

    const post = await uow.raidPosts.findOne({ where: { id: raidPost.id } });
    expect(post).toBeDefined();
    expect(post).toHaveProperty("server", "NA");
  });

  it("should change requirements when they differ from in-database ones", async () => {
    const user = await createAndSaveUser(uow.users, { username: "username" });
    const requirement = await createAndSaveItemRequirement(uow.requirements, {
      name: "Some Item",
      quantity: 1,
    });
    const raidPost = await createAndSaveRaidPost(uow.raidPosts, user, {
      date: addHours(new Date(), 1),
      requirements: [requirement],
    });
    const updateDto = createUpdateDto(raidPost.id, {
      requirementsProps: { itemsProps: [{ name: "Some Item", quantity: 2 }] },
    });

    await service.update(updateDto);

    const post = await uow.raidPosts.findOne({ where: { id: raidPost.id } });
    expect(post).toBeDefined();
    expect(post).toHaveProperty("requirements");
    expect(post!.requirements.length).toBe(1);
    expect(post!.requirements[0]).toHaveProperty("quantity", 2);
  });

  it("should change bosses when boss list differs from in-database one", async () => {
    const user = await createAndSaveUser(uow.users, { username: "username" });
    const boss1 = await createAndSaveRaidBoss(uow.raidBosses, {
      name: "boss1",
      isCm: true,
    });
    const boss2 = await createAndSaveRaidBoss(uow.raidBosses, {
      name: "boss2",
      isCm: true,
    });
    const boss3 = await createAndSaveRaidBoss(uow.raidBosses, {
      name: "boss3",
      isCm: true,
    });
    const raidPost = await createAndSaveRaidPost(uow.raidPosts, user, {
      date: addHours(new Date(), 1),
      bosses: [boss1, boss2],
    });
    const updateDto = createUpdateDto(raidPost.id, {
      bossesIds: [boss3.id],
    });

    await service.update(updateDto);

    const post = await uow.raidPosts.findOne({ where: { id: raidPost.id } });
    expect(post).toBeDefined();
    expect(post).toHaveProperty("bosses");
    expect(post!.bosses.length).toBe(1);
  });

  it("should not allow changing date to that in the past", async () => {
    const user = await createAndSaveUser(uow.users, { username: "username" });
    const raidPost = await createAndSaveRaidPost(uow.raidPosts, user, {
      date: addHours(new Date(), 1),
    });
    const updateDto = createUpdateDto(raidPost.id, {
      date: subtractHours(new Date(), 1),
    });

    expect(service.update(updateDto)).rejects.toThrow();
  });

  function createUpdateDto(
    id: number,
    dto: Partial<UpdateRaidPostDTO>
  ): UpdateRaidPostDTO {
    return {
      id,
      date: dto.date ?? addHours(new Date(), 1),
      server: dto.server ?? "EU",
      bossesIds: dto.bossesIds ?? [],
      rolesProps: dto.rolesProps ?? [],
      requirementsProps: dto.requirementsProps ?? { itemsProps: [] },
    };
  }
});
