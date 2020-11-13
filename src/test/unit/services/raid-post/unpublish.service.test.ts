import { unpublish } from "../../../../services/raid-post/unpublish.service";
import { createAndSaveLIRequirement } from "../../../helpers/li-requirement.helper";
import { createAndSaveRaidBoss } from "../../../helpers/raid-boss.helper";
import { createAndSaveRaidPost } from "../../../helpers/raid-post.helper";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { createAndSaveUser } from "../../../helpers/user.helper";

describe("RaidPost Service: unpublish tests", () => {
  const uow = RaidPostMemoryUnitOfWork.create();

  afterEach(async () => {
    await uow.deleteAll();
  });

  describe("if a post with given id exists", () => {
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
      const post = await createAndSaveRaidPost(uow.raidPosts, user, {
        bosses: [boss],
        requirements: [requirement],
      });
      id = post.id;
    });

    it("should remove a post from database", async () => {
      await unpublish({ id }, uow);

      const postInDb = await uow.raidPosts.findById(id);
      expect(postInDb).toBeUndefined();
    });

    it("should remove posts's requirements", async () => {
      const post = await uow.raidPosts.findById(id);
      const reqsIds = post!.requirements.map((r) => r.id);

      await unpublish({ id }, uow);

      const reqs = await uow.requirements.findByIds(reqsIds);
      expect(reqs.length).toBe(0);
    });

    // TODO
    // it("should remove post's roles");

    it("should NOT remove post's author", async () => {
      const post = await uow.raidPosts.findById(id);
      const authorId = post!.author.id;

      await unpublish({ id }, uow);

      const author = await uow.users.findById(authorId);
      expect(author).toBeDefined();
    });

    it("should NOT remove post's bosses", async () => {
      const post = await uow.raidPosts.findById(id);
      const bossesIds = post!.bosses.map((b) => b.id);

      await unpublish({ id }, uow);

      const bosses = await uow.raidBosses.findByIds(bossesIds);
      expect(bosses.length).toBeGreaterThan(0);
    });
  });

  // it("should not change the database state if no post with given id exists");
});
