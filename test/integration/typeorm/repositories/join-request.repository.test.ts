import { Connection } from "typeorm";
import { RaidBoss } from "@root/data/entities/raid-boss/raid-boss.entity";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { Role } from "@root/data/entities/role/role.entity";
import { User } from "@root/data/entities/user/user.entity";
import { JoinRequestRepository } from "@data/repositories/join-request/join-request.repository";
import { JoinRequest } from "@root/data/entities/join-request/join-request.entity";
import { loadTypeORM } from "@loaders/typeorm.loader";

describe("whatever", () => {
  let conn: Connection;
  beforeEach(async () => {
    conn = await loadTypeORM();
    await clean();
  });

  afterEach(async () => {
    await clean();
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

    const foundJoinRequest = await joinRequestRepo.findByKey(
      user.id,
      post.id,
      role.id
    );
    expect(foundJoinRequest).toBeDefined();
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
