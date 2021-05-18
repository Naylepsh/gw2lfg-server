import { addHours } from "../../../common/hours.util";
import { RaidBoss } from "@data/entities/raid-boss/raid-boss.entity";
import { RaidPost } from "@data/entities/raid-post/raid-post.entitity";
import { Role } from "@data/entities/role/role.entity";
import { User } from "@data/entities/user/user.entity";
import { GenericUnitOfWork } from "@data/units-of-work/generic.unit-of-work";
import { RaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work";
import { loadTypeORM } from "@loaders/typeorm.loader";
import { UpdateRaidPostService } from "@services/raid-post/update-raid-post.service";
import { Connection } from "typeorm";
import { JoinRequest } from "@data/entities/join-request/join-request.entity";

describe("UpdateRaidPostService Integration Tests", () => {
  let conn: Connection;
  let service: UpdateRaidPostService;
  let uow: RaidPostUnitOfWork;
  let post: RaidPost;

  beforeAll(async () => {
    conn = await loadTypeORM();
    uow = new RaidPostUnitOfWork(new GenericUnitOfWork(conn));

    service = new UpdateRaidPostService(uow);
  });

  beforeEach(async () => {
    post = await uow.withTransaction(async () => {
      const [dpsRole, healRole, author, boss] = await Promise.all([
        uow.roles.save(new Role({ name: "dps", class: "warrior" })),
        uow.roles.save(new Role({ name: "healer", class: "druid" })),
        uow.users.save(
          new User({
            username: "username",
            password: "password",
            apiKey: "api-key",
          })
        ),
        uow.raidBosses.save(new RaidBoss({ name: "Gorseval", isCm: false })),
      ]);

      const post = new RaidPost({
        server: "EU",
        date: addHours(new Date(), 1),
        author,
        roles: [dpsRole, healRole],
        bosses: [boss],
      });
      return uow.raidPosts.save(post);
    });
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

  it("should remove roles of post that werent passed", async () => {
    const roleToUpdate = post.roles[0];

    await service.update({
      ...post,
      bossesIds: post.bosses.map((b) => b.id),
      rolesProps: [roleToUpdate],
      requirementsProps: { itemsProps: [] },
    });

    const rolesInDb = await conn.getRepository(Role).find({});
    expect(rolesInDb.length).toBe(1);
    expect(rolesInDb[0]).toHaveProperty("id", roleToUpdate.id);
  });

  it("should remove join requests to removed roles", async () => {
    const roleToJoin = post.roles[0];
    const otherRole = post.roles[1];
    await uow.withTransaction(async () => {
      return uow.joinRequests.save(
        new JoinRequest({ user: post.author, post, role: roleToJoin })
      );
    });

    await service.update({
      ...post,
      bossesIds: post.bosses.map((b) => b.id),
      rolesProps: [otherRole],
      requirementsProps: { itemsProps: [] },
    });

    const joinRequestsInDb = await conn.getRepository(JoinRequest).find({});
    expect(joinRequestsInDb.length).toBe(0);
  });

  it("should update roles that were previously in database", async () => {
    const roleToUpdate = post.roles[0];
    roleToUpdate.name = "tank";

    await service.update({
      ...post,
      bossesIds: post.bosses.map((b) => b.id),
      rolesProps: [roleToUpdate],
      requirementsProps: { itemsProps: [] },
    });

    await uow.withTransaction(async () => {
      const updatedPost = await uow.raidPosts.findOne({
        where: { id: post.id },
      });
      expect(updatedPost).toBeDefined();
      expect(updatedPost?.roles.length).toBe(1);
      const role = updatedPost?.roles[0];
      expect(role).toHaveProperty("id", roleToUpdate.id);
      expect(role).toHaveProperty("name", roleToUpdate.name);
    });
  });

  it("should add roles that were not previously in database", async () => {
    const newRole = { name: "tank", class: "chronomancer" };

    await service.update({
      ...post,
      bossesIds: post.bosses.map((b) => b.id),
      rolesProps: [newRole],
      requirementsProps: { itemsProps: [] },
    });

    await uow.withTransaction(async () => {
      const updatedPost = await uow.raidPosts.findOne({
        where: { id: post.id },
      });
      expect(updatedPost).toBeDefined();
      expect(updatedPost?.roles.length).toBe(1);
      const role = updatedPost?.roles[0];
      expect(role).toHaveProperty("class", newRole.class);
      expect(role).toHaveProperty("name", newRole.name);
    });
  });

  it("should keep join requests to updated roles", async () => {
    const roleToJoin = post.roles[0];
    await uow.withTransaction(async () => {
      return uow.joinRequests.save(
        new JoinRequest({ user: post.author, post, role: roleToJoin })
      );
    });

    await service.update({
      ...post,
      bossesIds: post.bosses.map((b) => b.id),
      rolesProps: [roleToJoin],
      requirementsProps: { itemsProps: [] },
    });

    const joinRequestsInDb = await conn.getRepository(JoinRequest).find({});
    expect(joinRequestsInDb.length).toBe(1);
  });

  it("should NOT throw an error if no roles were changed", async () => {
    let threwAnError = false;

    try {
      await service.update({
        ...post,
        bossesIds: post.bosses.map((b) => b.id),
        rolesProps: post.roles,
        requirementsProps: { itemsProps: [] },
      });
    } catch (_error) {
      threwAnError = true;
    }

    expect(threwAnError).toBe(false);
  });
});
