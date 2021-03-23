import { Connection } from "typeorm";
import { JoinRequest } from "@data/entities/join-request/join-request.entity";
import { RaidBoss } from "@data/entities/raid-boss/raid-boss.entity";
import { RaidPost } from "@data/entities/raid-post/raid-post.entitity";
import { Role } from "@data/entities/role/role.entity";
import { User } from "@data/entities/user/user.entity";
import { GenericUnitOfWork } from "@data/units-of-work/generic.unit-of-work";
import { RaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work";
import { loadTypeORM } from "@loaders/typeorm.loader";
import { DeleteRaidPostService } from "@root/services/raid-post/delete-raid-post.service";
import { JoinRequestRepository } from "@data/repositories/join-request/join-request.repository";

describe("DeleteRaidPostService integration tests", () => {
  let conn: Connection;
  let uow: RaidPostUnitOfWork;
  let unpublishService: DeleteRaidPostService;

  beforeAll(async () => {
    conn = await loadTypeORM();

    const genericUow = new GenericUnitOfWork(conn);
    uow = new RaidPostUnitOfWork(genericUow);
    unpublishService = new DeleteRaidPostService(uow);
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
      const user = await uow.users.save(
        new User({
          username: "username",
          password: "password",
          apiKey: "api-key",
        })
      );
      const role = await uow.roles.save(
        new Role({ name: "any", class: "any" })
      );
      const boss = await uow.raidBosses.save(
        new RaidBoss({ name: "boss", isCm: false })
      );
      const raidPost = await uow.raidPosts.save(
        new RaidPost({
          server: "EU",
          date: new Date(),
          author: user,
          roles: [role],
          bosses: [boss],
        })
      );
      const joinRequest = await uow.joinRequests.save(
        new JoinRequest({ user, role, post: raidPost })
      );

      return { raidPost, joinRequest };
    });
  }

  it("should remove all related join requests on post deletion", async () => {
    const { raidPost, joinRequest } = await seedDb();

    await unpublishService.delete({ id: raidPost.id });

    await uow.withTransaction(async () => {
      const joinRequestsRepo = conn.getCustomRepository(JoinRequestRepository);
      const joinRequestInDb = await joinRequestsRepo.findById(joinRequest.id);
      expect(joinRequestInDb).toBeUndefined();
    });
  });
});
