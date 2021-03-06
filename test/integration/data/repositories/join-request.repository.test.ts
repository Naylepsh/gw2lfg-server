import { Connection } from "typeorm";
import { RaidBoss } from "@root/data/entities/raid-boss/raid-boss.entity";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { Role } from "@root/data/entities/role/role.entity";
import { User } from "@root/data/entities/user/user.entity";
import { JoinRequestRepository } from "@data/repositories/join-request/join-request.repository";
import { JoinRequest } from "@root/data/entities/join-request/join-request.entity";
import { loadTypeORM } from "@loaders/typeorm.loader";
import { byJoinRequestRelations } from "@root/data/queries/join-request.queries";

describe("whatever", () => {
  let conn: Connection;

  beforeAll(async () => {
    conn = await loadTypeORM();
  });

  beforeEach(async () => {
    await clean();
  });

  afterEach(async () => {
    await clean();
  });

  afterAll(async () => {
    await conn.close();
  });

  const clean = async () => {
    const joinRequestRepo = conn.getRepository(JoinRequest);
    await joinRequestRepo.delete({});

    const bossRepo = conn.getRepository(RaidBoss);
    await bossRepo.delete({});

    const roleRepo = conn.getRepository(Role);
    await roleRepo.delete({});

    const postRepo = conn.getRepository(RaidPost);
    await postRepo.delete({});

    const userRepo = conn.getRepository(User);
    await userRepo.delete({});
  };

  afterAll(async () => {
    await conn.close();
  });

  it("allow retrieval by relation keys", async () => {
    const post = await savePost(conn, "username1");
    const user = await saveUser(conn, "username2");
    const role = post.roles[0];

    const joinRequestRepo = conn.getCustomRepository(JoinRequestRepository);
    await joinRequestRepo.save(new JoinRequest({ user, post, role }));

    const foundJoinRequests = await joinRequestRepo.findMany(
      byJoinRequestRelations({
        userId: user.id,
        postId: post.id,
        roleId: role.id,
      })
    );
    expect(foundJoinRequests.length).toBeGreaterThan(0);
    expect(foundJoinRequests[0]).toBeDefined();
  });

  it("should populate relations", async () => {
    const post = await savePost(conn, "username1");
    const user = await saveUser(conn, "username2");
    const role = post.roles[0];

    const joinRequestRepo = conn.getCustomRepository(JoinRequestRepository);
    await joinRequestRepo.save(new JoinRequest({ user, post, role }));

    const foundJoinRequests = await joinRequestRepo.findMany(
      byJoinRequestRelations({
        userId: user.id,
        postId: post.id,
        roleId: role.id,
      })
    );

    expect(foundJoinRequests.length).toBeGreaterThan(0);
    const joinRequest = foundJoinRequests[0];
    expect(joinRequest).toHaveProperty("user");
    expect(joinRequest).toHaveProperty("post");
    expect(joinRequest).toHaveProperty("role");
  });
});

async function savePost(conn: Connection, username: string) {
  const bossRepo = conn.getRepository(RaidBoss);
  const boss = await bossRepo.save({ name: "b", isCm: false });

  const user = await saveUser(conn, username);

  const roleRepo = conn.getRepository(Role);
  const role = new Role({ name: "dps", class: "Any" });
  await roleRepo.save(role);

  const postRepo = conn.getRepository(RaidPost);
  const post = new RaidPost({
    date: new Date(),
    server: "s",
    author: user,
    roles: [role],
    bosses: [boss],
  });

  const savedPost = await postRepo.save(post);
  return savedPost;
}

async function saveUser(conn: Connection, username: string) {
  const userRepo = conn.getRepository(User);
  const user = await userRepo.save(
    new User({ username, password: "p", apiKey: "a" })
  );
  return user;
}
