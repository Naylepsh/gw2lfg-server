import { Connection } from "typeorm";
import { JoinRequest } from "@data/entities/join-request/join-request.entity";
import { RaidBoss } from "@data/entities/raid-boss/raid-boss.entity";
import { RaidPost } from "@data/entities/raid-post/raid-post.entitity";
import { Role } from "@data/entities/role/role.entity";
import { User } from "@data/entities/user/user.entity";
import { GenericUnitOfWork } from "@data/units-of-work/generic.unit-of-work";
import { RaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work";
import { loadTypeORM } from "@loaders/typeorm.loader";
import { UnpublishRaidPostService } from "@services/raid-post/unpublish-raid-post.service";
import { JoinRequestRepository } from "@data/repositories/join-request/join-request.repository";
import { UserRepository } from "@data/repositories/user/user.repository";
import { RoleRepository } from "@data/repositories/role/role.repository";
import { RaidBossRepository } from "@data/repositories/raid-boss/raid-boss.repository";
import { RaidPostRepository } from "@data/repositories/raid-post/raid-post.repository";

describe("UnpublishRaidPostService integration tests", () => {
  let conn: Connection;
  let uow: RaidPostUnitOfWork;
  let unpublishService: UnpublishRaidPostService;

  beforeAll(async () => {
    conn = await loadTypeORM();

    const genericUow = new GenericUnitOfWork(conn);
    uow = new RaidPostUnitOfWork(genericUow);
    unpublishService = new UnpublishRaidPostService(uow);
  });

  afterEach(async () => {
    await conn.getCustomRepository(JoinRequestRepository).delete({});
    await conn.getCustomRepository(RoleRepository).delete({});
    await conn.getCustomRepository(RaidBossRepository).delete({});
    await conn.getCustomRepository(RaidPostRepository).delete({});
    await conn.getCustomRepository(UserRepository).delete({});
  });

  afterAll(async () => {
    await conn.close();
  });

  it("should remove all related join requests on post deletion", async () => {
    await uow.withTransaction(async () => {
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
      unpublishService = new UnpublishRaidPostService(
        new RaidPostUnitOfWork(new GenericUnitOfWork(conn))
      );

      // unpublish uses uow.withTransaction which kills the uow,
      // thus subsequent db calls have to come form repositories outside of uow
      await unpublishService.unpublish({ id: raidPost.id });

      const joinRequestsRepo = conn.getCustomRepository(JoinRequestRepository);
      const joinRequestInDb = await joinRequestsRepo.findById(joinRequest.id);
      expect(joinRequestInDb).toBeUndefined();
    });
  });
});
