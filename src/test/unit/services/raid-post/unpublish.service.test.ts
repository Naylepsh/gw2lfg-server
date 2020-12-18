import { UnpublishRaidPostService } from "@services/raid-post/unpublish.service";
import { createAndSaveLIRequirement } from "../../../helpers/li-requirement.helper";
import { createAndSaveRaidBoss } from "../../../helpers/raid-boss.helper";
import { createAndSaveRaidPost } from "../../../helpers/raid-post.helper";
import { createAndSaveRole } from "../../../helpers/role.helper";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { createAndSaveUser } from "../../../helpers/user.helper";

describe("RaidPost Service: unpublish tests", () => {
  const uow = RaidPostMemoryUnitOfWork.create();
  const unpublishService = new UnpublishRaidPostService(uow);
  let id: number;

  beforeEach(async () => {
    const user = await createAndSaveUser(uow.users, { username: "username" });
    const boss = await createAndSaveRaidBoss(uow.raidBosses, {
      name: "boss",
      isCm: false,
    });
    const requirement = await createAndSaveLIRequirement(uow.requirements, {
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
      await unpublishService.unpublish({ id });

      const postInDb = await uow.raidPosts.findById(id);
      expect(postInDb).toBeUndefined();
    });

    it("should remove posts's requirements", async () => {
      const post = await uow.raidPosts.findById(id);
      const reqsIds = post!.requirements.map((r) => r.id);

      await unpublishService.unpublish({ id });

      const reqs = await uow.requirements.findByIds(reqsIds);
      expect(reqs.length).toBe(0);
    });

    it("should remove post's roles", async () => {
      const post = await uow.raidPosts.findById(id);
      const rolesIds = post!.roles.map((r) => r.id);

      await unpublishService.unpublish({ id });

      const roles = await uow.requirements.findByIds(rolesIds);
      expect(roles.length).toBe(0);
    });

    it("should NOT remove post's author", async () => {
      const post = await uow.raidPosts.findById(id);
      const authorId = post!.author.id;

      await unpublishService.unpublish({ id });

      const author = await uow.users.findById(authorId);
      expect(author).toBeDefined();
    });

    it("should NOT remove post's bosses", async () => {
      const post = await uow.raidPosts.findById(id);
      const bossesIds = post!.bosses.map((b) => b.id);

      await unpublishService.unpublish({ id });

      const bosses = await uow.raidBosses.findByIds(bossesIds);
      expect(bosses.length).toBeGreaterThan(0);
    });
  });

  it("should not change the database state if no post with given id exists", async () => {
    const post = await uow.raidPosts.findById(id);
    const idNotInDb = id + 1;

    await unpublishService.unpublish({ id: idNotInDb });

    const _post = await uow.raidPosts.findById(post!.id);
    expect(_post).toBeDefined();
  });
});
