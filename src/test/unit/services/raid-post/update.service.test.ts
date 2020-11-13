import {
  update,
  UpdateRaidPostDTO,
} from "../../../../services/raid-post/update.service";
import { createAndSaveRaidBoss } from "../../../helpers/raid-boss.helper";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { createAndSaveUser } from "../../../helpers/user.helper";
import { createAndSaveRaidPost } from "../../../helpers/raid-post.helper";
import { addHours } from "./hours.util";

describe("RaidPost Service: update tests", () => {
  const uow = RaidPostMemoryUnitOfWork.create();

  afterEach(async () => {
    await uow.deleteAll();
  });

  it("should update a post when valid data was passed", async () => {
    const user = await createAndSaveUser(uow.users, { username: "username" });
    const raidPost = await createAndSaveRaidPost(uow.raidPosts, user, {
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
  // it('should change requirements when they differ from in-database ones')
  // it('should change roles when they differ from in-database ones')

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
    const updateDto = createUpdateDto(raidPost.id, user.id, {
      bossesIds: [boss3.id],
    });

    await update(updateDto, uow);

    const post = await uow.raidPosts.findById(raidPost.id);
    expect(post).toBeDefined();
    expect(post).toHaveProperty("bosses");
    expect(post!.bosses.length).toBe(1);
  });

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
