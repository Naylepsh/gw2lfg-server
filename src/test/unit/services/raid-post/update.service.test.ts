import { LIRequirement } from "@data/entities/requirement.entity";
import {
  UpdateRaidPostDTO,
  UpdateRaidPostService,
} from "@services/raid-post/update.service";
import { createAndSaveLIRequirement } from "@test/helpers/li-requirement.helper";
import { createAndSaveRaidBoss } from "@test/helpers/raid-boss.helper";
import { createAndSaveRaidPost } from "@test/helpers/raid-post.helper";
import { createAndSaveRole } from "@test/helpers/role.helper";
import { RaidPostMemoryUnitOfWork } from "@test/helpers/uows/raid-post.memory-unit-of-work";
import { createAndSaveUser } from "@test/helpers/user.helper";
import { addHours, subtractHours } from "./hours.util";

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

    const post = await uow.raidPosts.findById(raidPost.id);
    expect(post).toBeDefined();
    expect(post).toHaveProperty("server", "NA");
  });

  it("should change requirements when they differ from in-database ones", async () => {
    const user = await createAndSaveUser(uow.users, { username: "username" });
    const requirement = await createAndSaveLIRequirement(uow.requirements, {
      quantity: 1,
    });
    const raidPost = await createAndSaveRaidPost(uow.raidPosts, user, {
      date: addHours(new Date(), 1),
      requirements: [requirement],
    });
    const updateDto = createUpdateDto(raidPost.id, {
      requirementsProps: [{ name: LIRequirement.itemName, quantity: 2 }],
    });

    await service.update(updateDto);

    const post = await uow.raidPosts.findById(raidPost.id);
    expect(post).toBeDefined();
    expect(post).toHaveProperty("requirements");
    expect(post!.requirements.length).toBe(1);
    expect(post!.requirements[0]).toHaveProperty("quantity", 2);
  });

  it("should change roles when they differ from in-database ones", async () => {
    const user = await createAndSaveUser(uow.users, { username: "username" });
    const role = await createAndSaveRole(uow.roles, { name: "DPS" });
    const raidPost = await createAndSaveRaidPost(uow.raidPosts, user, {
      date: addHours(new Date(), 1),
      roles: [role],
    });
    const updateDto = createUpdateDto(raidPost.id, {
      rolesProps: [{ name: "Healer", class: "Druid" }],
    });

    await service.update(updateDto);

    const post = await uow.raidPosts.findById(raidPost.id);
    expect(post).toBeDefined();
    expect(post).toHaveProperty("requirements");
    expect(post!.roles.length).toBe(1);
    expect(post!.roles[0]).toHaveProperty("name", "Healer");
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

    const post = await uow.raidPosts.findById(raidPost.id);
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
      requirementsProps: dto.requirementsProps ?? [],
    };
  }
});
