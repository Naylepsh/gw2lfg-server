import { raids } from "@data/entities/raid-boss/gw2-raids.json";
import { RaidBoss } from "@root/data/entities/raid-boss/raid-boss.entity";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";
import { User } from "@data/entities/user/user.entity";
import { IRaidBossRepository } from "@data/repositories/raid-boss/raid-boss.repository.interface";
import { IRaidPostUnitOfWork } from "@data/units-of-work/raid-post/raid-post.unit-of-work.interface";
import { types } from "@loaders/typedi.constants";
import request from "supertest";
import Container from "typedi";
import { addHours } from "../common/hours.util";
import { getGw2ApiKey } from "../common/get-gw2-api-key";
import { AUTH_HEADER, toBearerToken } from "../common/to-bearer-token";

interface IUser {
  username: string;
  password: string;
  apiKey: string;
}

const _user: IUser = {
  username: "username",
  password: "password",
  apiKey: getGw2ApiKey(),
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
    date: addHours(new Date(), 10).toISOString(),
    description: "bring potions and food",
    bossesIds,
    rolesProps: [roleProps],
  };

  const { body } = await request(app)
    .post(publishUrl)
    .send(post)
    .set(AUTH_HEADER, toBearerToken(token));

  const raidPost = new RaidPost({
    ...body.data,
    date: new Date(body.data.date),
  });
  raidPost.id = body.data.id;
  return raidPost;
};

export const seedRaidBoss = async (container: typeof Container) => {
  const encounter = raids[0].encounters[0];
  const boss = new RaidBoss({ name: encounter.name, isCm: false });
  const raidBossRepo: IRaidBossRepository = container.get(
    types.repositories.raidBoss
  );
  const { id } = await raidBossRepo.save(boss);

  return id;
};

export const seedUser = async (app: any) => {
  const registerUrl = "/register";

  const { body, status } = await request(app).post(registerUrl).send(_user);
  if (status !== 201) {
    console.log("Official GW2API error!! Try again later");
    console.log(body);
    throw new Error("stopping jest");
  }

  const user: User = { ...body.data.user, ..._user };
  return { user, token: body.data.token as string };
};

export const clean = async (uow: IRaidPostUnitOfWork) => {
  return await uow.withTransaction(async () => {
    await uow.joinRequests.delete({});
    await uow.roles.delete({});
    await uow.raidPosts.delete({});
    await uow.raidBosses.delete({});
    await uow.users.delete({});
    await uow.requirements.delete({});
  });
};
