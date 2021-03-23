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
      const oldPostInDb = await uow.raidPosts.findById(oldPost.id);
      expect(oldPostInDb).toBeUndefined();
    });
  });

  // it("should NOT delete later posts");
  // it("should delete related join requests");
  // it("should delete related requirements");
  // it("should delete related roles");
});
