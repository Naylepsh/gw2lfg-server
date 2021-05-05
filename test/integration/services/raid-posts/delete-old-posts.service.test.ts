import { Connection } from "typeorm";
import { JoinRequest } from "@data/entities/join-request/join-request.entity";
import { RaidBoss } from "@data/entities/raid-boss/raid-boss.entity";
import { RaidPost } from "@data/entities/raid-post/raid-post.entitity";
import { Role } from "@data/entities/role/role.entity";
import { User } from "@data/entities/user/user.entity";
import { GenericUnitOfWork } from "@data/units-of-work/generic.unit-of-work";
import { RaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work";
import { loadTypeORM } from "@loaders/typeorm.loader";
import { DeleteOldPostsService } from "@services/raid-post/delete-old-posts.service";
import { addHours } from "../../../common/hours.util";

describe("DeleteOldPostsService integration tests", () => {
  let conn: Connection;
  let uow: RaidPostUnitOfWork;
  let deleteOldPostsService: DeleteOldPostsService;

  beforeAll(async () => {
    conn = await loadTypeORM();

    const genericUow = new GenericUnitOfWork(conn);
    uow = new RaidPostUnitOfWork(genericUow);
    deleteOldPostsService = new DeleteOldPostsService(uow);
  });

  afterEach(async () => {
    await uow.withTransaction(async () => {
      await uow.joinRequests.delete({});
      await uow.roles.delete({});
      await uow.raidBosses.delete({});
      await uow.raidPosts.delete({});
      await uow.users.delete({});
    });
  });

  afterAll(async () => {
    await conn.close();
  });

  async function seedDb() {
    return await uow.withTransaction(async () => {
      const [user, boss, role1, role2] = await Promise.all([
        uow.users.save(
          new User({
            username: "username",
            password: "password",
            apiKey: "api-key",
          })
        ),
        uow.raidBosses.save(new RaidBoss({ name: "boss", isCm: false })),
        uow.roles.save(new Role({ name: "any", class: "any" })),
        uow.roles.save(new Role({ name: "any", class: "any" })),
      ]);

      const [oldPost, laterPost] = await Promise.all([
        await uow.raidPosts.save(
          new RaidPost({
            server: "EU",
            date: addHours(new Date(), -1),
            author: user,
            roles: [role1],
            bosses: [boss],
          })
        ),
        uow.raidPosts.save(
          new RaidPost({
            server: "EU",
            date: addHours(new Date(), 1),
            author: user,
            roles: [role2],
            bosses: [boss],
          })
        ),
      ]);

      const [joinRequest1, joinRequest2] = await Promise.all([
        uow.joinRequests.save(
          new JoinRequest({ user, role: role1, post: oldPost })
        ),
        uow.joinRequests.save(
          new JoinRequest({ user, role: role2, post: laterPost })
        ),
      ]);

      return {
        oldPost,
        laterPost,
        requestToOldPost: joinRequest1,
        requestToLaterPost: joinRequest2,
      };
    });
  }

  it("should delete old posts", async () => {
    const { oldPost } = await seedDb();

    await deleteOldPostsService.deleteOldPosts();

    await uow.withTransaction(async () => {
      const oldPostInDb = await uow.raidPosts.findOne({
        where: { id: oldPost.id },
      });
      expect(oldPostInDb).toBeUndefined();
    });
  });

  it("should NOT delete later posts", async () => {
    const { laterPost } = await seedDb();

    await deleteOldPostsService.deleteOldPosts();

    await uow.withTransaction(async () => {
      const laterPostInDb = await uow.raidPosts.findOne({
        where: { id: laterPost.id },
      });
      expect(laterPostInDb).toBeDefined();
    });
  });

  it("should delete related join requests", async () => {
    const { requestToOldPost } = await seedDb();

    await deleteOldPostsService.deleteOldPosts();

    await uow.withTransaction(async () => {
      const requestToPostInDb = await uow.joinRequests.findOne({
        where: { id: requestToOldPost.id },
      });
      expect(requestToPostInDb).toBeUndefined();
    });
  });

  it("should NOT delete non-related join requests", async () => {
    const { requestToLaterPost } = await seedDb();

    await deleteOldPostsService.deleteOldPosts();

    await uow.withTransaction(async () => {
      const requestToPostInDb = await uow.joinRequests.findOne({
        where: { id: requestToLaterPost.id },
      });
      expect(requestToPostInDb).toBeDefined();
    });
  });

  it("should delete related roles", async () => {
    const { oldPost } = await seedDb();

    await deleteOldPostsService.deleteOldPosts();

    await uow.withTransaction(async () => {
      expect(oldPost.roles.length).toBeGreaterThanOrEqual(1);
      const role = oldPost.roles[0];
      const roleOfOlderPostInDb = await uow.roles.findOne({
        where: { id: role.id },
      });
      expect(roleOfOlderPostInDb).toBeUndefined();
    });
  });

  it("should NOT delete non-related roles", async () => {
    const { laterPost } = await seedDb();

    await deleteOldPostsService.deleteOldPosts();

    await uow.withTransaction(async () => {
      expect(laterPost.roles.length).toBeGreaterThanOrEqual(1);
      const role = laterPost.roles[0];
      const roleOfLaterPostInDb = await uow.roles.findOne({
        where: { id: role.id },
      });
      expect(roleOfLaterPostInDb).toBeDefined();
    });
  });
});
