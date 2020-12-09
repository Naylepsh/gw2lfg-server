import { Connection } from "typeorm";
import { RaidBoss } from "../../../data/entities/raid-boss.entity";
import { RaidPost } from "../../../data/entities/raid-post.entitity";
import { Role } from "../../../data/entities/role.entity";
import { User } from "../../../data/entities/user.entity";
import { loadTypeORM } from "../../../loaders/typeorm.loader";

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

  it("should work", async () => {
    const bossRepo = conn.getRepository(RaidBoss);
    const boss = await bossRepo.save({ name: "b", isCm: false });

    const userRepo = conn.getRepository(User);
    const user = await userRepo.save(
      new User({ username: "u", password: "p", apiKey: "a" })
    );
    console.log("user saved");

    const roleRepo = conn.getRepository(Role);
    const role = new Role({ name: "dps" });
    await roleRepo.save(role);
    console.log("role saved");

    const postRepo = conn.getRepository(RaidPost);
    const post = new RaidPost({
      date: new Date(),
      server: "s",
      author: user,
      roles: [role],
      bosses: [boss],
    });
    await postRepo.save(post);
    console.log("post saved");

    const roles = await roleRepo.find({});

    expect(roles.length).toBe(1);
  });
});
