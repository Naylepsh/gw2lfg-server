import { RaidBossRepository } from "@data/repositories/raid-boss/raid-boss.repository";
import { IRaidBossRepository } from "@data/repositories/raid-boss/raid-boss.repository.interface";
import { RaidPostRepository } from "@data/repositories/raid-post/raid-post.repository";
import { IRaidPostRepository } from "@data/repositories/raid-post/raid-post.repository.interface";
import { RequirementRepository } from "@data/repositories/requirement/requirement.repository";
import { IRequirementRepository } from "@data/repositories/requirement/requirement.repository.interface";
import { RoleRepository } from "@data/repositories/role/role.repository";
import { IRoleRepository } from "@data/repositories/role/role.repository.interface";
import { UserRepository } from "@data/repositories/user/user.repository";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { loadTypeORM } from "@loaders/typeorm.loader";
import { Connection } from "typeorm";
import { createAndSaveItemRequirement } from "../../../common/item-requirement.helper";
import { createAndSaveRaidBoss } from "../../../common/raid-boss.helper";
import { createAndSaveRaidPost } from "../../../common/raid-post.helper";
import { createAndSaveRole } from "../../../common/role.helper";
import { createAndSaveUser } from "../../../common/user.helper";

class PostRepositoryTestObject {
  user: { username: string };
  role: { name: string; class: string };
  requirement: { name: string; quantity: number };
  boss: { name: string; isCm: boolean };

  constructor() {
    this.user = { username: "username" };
    this.role = { name: "any", class: "any" };
    this.requirement = { name: "Some Item", quantity: 1 };
    this.boss = { name: "Boss", isCm: false };
  }
}

describe("TypeORM posting repository tests", () => {
  let connection: Connection;
  let postRepository: IRaidPostRepository;
  let userRepository: IUserRepository;
  let roleRepository: IRoleRepository;
  let requirementRepository: IRequirementRepository;
  let bossRepository: IRaidBossRepository;

  let obj = new PostRepositoryTestObject();

  beforeAll(async () => {
    connection = await loadTypeORM();

    postRepository = connection.getCustomRepository(RaidPostRepository);
    userRepository = connection.getCustomRepository(UserRepository);
    requirementRepository = connection.getCustomRepository(
      RequirementRepository
    );
    roleRepository = connection.getCustomRepository(RoleRepository);
    bossRepository = connection.getCustomRepository(RaidBossRepository);
  });

  afterEach(async () => {
    await requirementRepository.delete({});
    await roleRepository.delete({});
    await postRepository.delete({});
    await userRepository.delete({});
    await bossRepository.delete({});

    resetTestObject();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should find raid post by core properties", async () => {
    const { post } = await seedDb();

    const postingInDb = await postRepository.findOne({
      where: { id: post.id },
    });

    expect(postingInDb).not.toBeUndefined();
  });

  it("should find raid post by bosses ids", async () => {
    const { boss } = await seedDb();

    const postingInDb = await postRepository.findOne({
      where: { bossesIds: [boss.id] },
    });

    expect(postingInDb).not.toBeUndefined();
  });

  function resetTestObject() {
    obj = new PostRepositoryTestObject();
  }

  async function seedDb() {
    const [author, role, requirement, boss] = await Promise.all([
      createAndSaveUser(userRepository, {
        username: obj.user.username,
      }),
      createAndSaveRole(roleRepository, {
        ...obj.role,
      }),
      createAndSaveItemRequirement(requirementRepository, {
        ...obj.requirement,
      }),
      createAndSaveRaidBoss(bossRepository, { ...obj.boss }),
    ]);

    const post = await createAndSaveRaidPost(postRepository, author, {
      roles: [role],
      requirements: [requirement],
      bosses: [boss],
    });

    return { author, role, post, boss };
  }
});
