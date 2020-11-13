import { RaidPost } from "../../../../entities/raid-post.entitity";
import { User } from "../../../../entities/user.entity";
import {
  update,
  UpdateRaidPostDTO,
} from "../../../../services/raid-post/update.service";
import { createAndSaveRaidBoss } from "../../../helpers/raid-boss.helper";
import { RaidBossMemoryRepository } from "../../../helpers/repositories/raid-boss.memory-repository";
import { RaidPostMemoryRepository } from "../../../helpers/repositories/raid-post.memory-repository";
import { RequirementMemoryRepository } from "../../../helpers/repositories/requirement.memory-repository";
import { RoleMemoryRepository } from "../../../helpers/repositories/role.memory-repository";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { createAndSaveUser } from "../../../helpers/user.helper";
import { addHours } from "./hours.util";

describe("RaidPost Service: update tests", () => {
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

  it("should update a post when valid data was passed", async () => {
    const user = await addUser({ username: "username" });
    const raidPost = await addRaidPost(user, {
      date: addHours(new Date(), 1),
    });
    const updateDto = createUpdateDto(raidPost.id, user.id, { server: "NA" });

    await update(updateDto, uow);

    const post = await uow.raidPosts.findById(raidPost.id);
    expect(post).toBeDefined();
    expect(post).toHaveProperty("server", "NA");
  });

  // TODO:
  // it('should not allow author change')

  it("should change bosses when boss list differs from in-database one", async () => {
    const user = await addUser({ username: "username" });
    const boss1 = await addRaidBoss({ name: "boss1", isCm: true });
    const boss2 = await addRaidBoss({ name: "boss2", isCm: true });
    const boss3 = await addRaidBoss({ name: "boss2", isCm: true });
    const raidPost = await addRaidPost(user, {
      date: addHours(new Date(), 1),
      bosses: [boss1, boss2],
    });
    const updateDto = createUpdateDto(raidPost.id, user.id, {
      bossesIds: [boss3.id],
    });

    await update(updateDto, uow);

    const post = await uow.raidPosts.findById(raidPost.id);
    expect(post).toBeDefined();
    expect(post).toHaveProperty("bosses");
    expect(post!.bosses.length).toBe(1);
  });

  function addUser(user: { username: string }) {
    return createAndSaveUser(uow.users, user);
  }

  function addRaidBoss(raidBoss: { name: string; isCm: boolean }) {
    return createAndSaveRaidBoss(uow.raidBosses, raidBoss);
  }

  function addRaidPost(author: User, raidPost: Partial<RaidPost>) {
    const post = new RaidPost({
      author,
      date: raidPost.date ?? new Date(),
      server: raidPost.server ?? "EU",
      bosses: raidPost.bosses ?? [],
      requirements: raidPost.requirements ?? [],
      roles: raidPost.roles ?? [],
    });
    return uow.raidPosts.save(post);
  }

  function createUpdateDto(
    id: number,
    authorId: number,
    dto: Partial<UpdateRaidPostDTO>
  ): UpdateRaidPostDTO {
    return {
      id,
      authorId,
      date: dto.date ?? addHours(new Date(), 1),
      server: dto.server ?? "EU",
      bossesIds: dto.bossesIds ?? [],
      rolesProps: dto.rolesProps ?? [],
      requirementsProps: dto.requirementsProps ?? [],
    };
  }
});
