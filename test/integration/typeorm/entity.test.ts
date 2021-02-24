import { Connection, In } from "typeorm";
import { RaidBoss } from "@root/data/entities/raid-boss/raid-boss.entity";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { Role } from "@root/data/entities/role/role.entity";
import { User } from "@root/data/entities/user/user.entity";
import { loadTypeORM } from "@loaders/typeorm.loader";

describe("whatever", () => {
  let conn: Connection;

  beforeAll(async () => {
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
    await postRepo.save(post);

    const roles = await roleRepo.find({});

    expect(roles.length).toBe(1);
  });

  it("should find by id in array", async () => {
    const userRepo = conn.getRepository(User);
    const user = await userRepo.save(
      new User({ username: "u", password: "p", apiKey: "a" })
    );
    const foundUser = await userRepo.findOne({ where: { id: In([user.id]) } });
    expect(foundUser).toBeDefined();
    expect(foundUser).toHaveProperty("username", user.username);
  });

  it("should find by id in array in nested relation", async () => {
    const bossRepo = conn.getRepository(RaidBoss);
    const boss = await bossRepo.save({ name: "b", isCm: false });

    const userRepo = conn.getRepository(User);
    const user = await userRepo.save(
      new User({ username: "u", password: "p", apiKey: "a" })
    );

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
    await postRepo.save(post);

    const postFound = await postRepo.findOne({
      where: { author: { id: In([user.id]) } },
    });

    expect(postFound).toBeDefined();
    expect(postFound).toHaveProperty("id", post.id);
  });

  it("should find by id in array in nested many-to-many relation", async () => {
    const bossRepo = conn.getRepository(RaidBoss);
    const boss = await bossRepo.save({ name: "b", isCm: false });

    const userRepo = conn.getRepository(User);
    const user = await userRepo.save(
      new User({ username: "u", password: "p", apiKey: "a" })
    );

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
    await postRepo.save(post);

    const postFound = await postRepo.findOne({
      relations: ["bosses", "roles"],
      join: {
        alias: "post",
        innerJoin: { roles: "post.roles", bosses: "post.bosses" },
      },
      where: (qb: any) => {
        qb.where({ server: "s" }).andWhere("bosses.name = :bossName", {
          bossName: "b",
        });
      },
      // where: { roles: { name: "dps" } },
      // where: { bosses: { id: boss.id } },
      // where: { bosses: { id: In([boss.id]) } },
      // where: {
      //   bosses: In([{ id: boss.id, name: boss.name, isCm: boss.isCm }]),
      // },
    });

    console.log(postFound);

    expect(postFound).toBeDefined();
    expect(postFound).toHaveProperty("id", post.id);
  });
});
