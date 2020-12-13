import request from "supertest";
import Container from "typedi";
import { raids } from "../../data/entities/gw2-raids.json";
import { raidBossRepositoryType } from "../../loaders/typedi.constants";
import { RaidBoss } from "../../data/entities/raid-boss.entity";
import { addHours } from "../unit/services/raid-post/hours.util";
import { CurrentUserJWTMiddleware } from "../../api/middleware/current-user.middleware";
import { IRaidBossRepository } from "../../data/repositories/raid-boss/raid-boss.repository.interface";
import { RaidPost } from "../../data/entities/raid-post.entitity";
import { IRaidPostUnitOfWork } from "../../data/units-of-work/raid-post/raid-post.unit-of-work.interface";

interface IUser {
  username: string;
  password: string;
  apiKey: string;
}

const user: IUser = {
  username: "username",
  password: "password",
  apiKey: process.env.GW2API_TOKEN as string,
};

export const seedRaidPost = async (
  app: any,
  bossesIds: number[],
  token: string
) => {
  const publishUrl = "/raid-posts";
  const roleProps = { name: "DPS", class: "Any" };
  const post = {
    server: "EU",
    date: addHours(new Date(), 10),
    description: "bring potions and food",
    bossesIds,
    rolesProps: [roleProps],
  };

  const { body } = await request(app)
    .post(publishUrl)
    .send(post)
    .set(CurrentUserJWTMiddleware.AUTH_HEADER, token);

  const raidPost = new RaidPost(body);
  raidPost.id = body.id;
  return raidPost;
};

export const seedRaidBoss = async (container: typeof Container) => {
  const encounter = raids[0].encounters[0];
  const boss = new RaidBoss({ name: encounter.name, isCm: false });
  const raidBossRepo: IRaidBossRepository = container.get(
    raidBossRepositoryType
  );
  const { id } = await raidBossRepo.save(boss);

  return id;
};

export const seedUserAndGetToken = async (app: any) => {
  const loginUrl = "/login";

  await seedUser(app);

  const { body: token } = await request(app)
    .post(loginUrl)
    .send({ username: user.username, password: user.password });

  return token;
};

export const seedUser = async (app: any): Promise<IUser> => {
  const registerUrl = "/register";

  await request(app).post(registerUrl).send(user);

  return { ...user };
};

export const clean = async (uow: IRaidPostUnitOfWork) => {
  return await uow.withTransaction(async () => {
    await uow.roles.delete({});
    await uow.raidPosts.delete({});
    await uow.raidBosses.delete({});
    await uow.users.delete({});
    await uow.requirements.delete({});
  });
};
