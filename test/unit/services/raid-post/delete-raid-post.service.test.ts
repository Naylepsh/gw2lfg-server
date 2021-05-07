import { DeleteRaidPostService } from "@root/services/raid-post/delete-raid-post.service";
import { createAndSaveItemRequirement } from "../../../common/item-requirement.helper";
import { createAndSaveRaidBoss } from "../../../common/raid-boss.helper";
import { createAndSaveRaidPost } from "../../../common/raid-post.helper";
import { createAndSaveRole } from "../../../common/role.helper";
import { RaidPostMemoryUnitOfWork } from "../../../common/uows/raid-post.memory-unit-of-work";
import { createAndSaveUser } from "../../../common/user.helper";
import { byId } from "@data/queries/common/by-id.query";

describe("DeleteRaidPost Service tests", () => {
  const uow = RaidPostMemoryUnitOfWork.create();
  const unpublishService = new DeleteRaidPostService(uow);
  let id: number;

  beforeEach(async () => {
    const user = await createAndSaveUser(uow.users, { username: "username" });
    const boss = await createAndSaveRaidBoss(uow.raidBosses, {
      name: "boss",
      isCm: false,
    });
    const requirement = await createAndSaveItemRequirement(uow.requirements, {
      name: "Some Item",
      quantity: 1,
    });
    const role = await createAndSaveRole(uow.roles, { name: "DPS" });
    const post = await createAndSaveRaidPost(uow.raidPosts, user, {
      bosses: [boss],
      requirements: [requirement],
      roles: [role],
    });
    id = post.id;
  });

  afterEach(async () => {
    await uow.deleteAll();
  });

  describe("if a post with given id exists", () => {
    it("should remove a post from database", async () => {
      await unpublishService.delete({ id });

      const postInDb = await uow.raidPosts.findOne(byId(id));
      expect(postInDb).toBeUndefined();
    });

    it("should remove posts's requirements", async () => {
      const post = await uow.raidPosts.findOne(byId(id));
      const reqsIds = post!.requirements.map((r) => r.id);

      await unpublishService.delete({ id });

      const reqs = await uow.requirements.findByIds(reqsIds);
      expect(reqs.length).toBe(0);
    });

    it("should remove post's roles", async () => {
      const post = await uow.raidPosts.findOne(byId(id));
      const rolesIds = post!.roles.map((r) => r.id);

      await unpublishService.delete({ id });

      const roles = await uow.requirements.findByIds(rolesIds);
      expect(roles.length).toBe(0);
    });

    it("should NOT remove post's author", async () => {
      const post = await uow.raidPosts.findOne(byId(id));
      const authorId = post!.author.id;

      await unpublishService.delete({ id });

      const author = await uow.users.findById(authorId);
      expect(author).toBeDefined();
    });

    it("should NOT remove post's bosses", async () => {
      const post = await uow.raidPosts.findOne(byId(id));
      const bossesIds = post!.bosses.map((b) => b.id);

      await unpublishService.delete({ id });

      const bosses = await uow.raidBosses.findByIds(bossesIds);
      expect(bosses.length).toBeGreaterThan(0);
    });
  });

  it("should not change the database state if no post with given id exists", async () => {
    const post = await uow.raidPosts.findOne(byId(id));
    const idNotInDb = id + 1;

    await unpublishService.delete({ id: idNotInDb });

    const _post = await uow.raidPosts.findOne(byId(post!.id));
    expect(_post).toBeDefined();
  });
});
