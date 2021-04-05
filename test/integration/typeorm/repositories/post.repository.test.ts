import { Connection } from "typeorm";
import { loadTypeORM } from "@loaders/typeorm.loader";
import { PostRepository } from "@data/repositories/post/post.repository";
import { IPostRepository } from "@data/repositories/post/post.repository.interface";
import { RequirementRepository } from "@data/repositories/requirement/requirement.repository";
import { IRequirementRepository } from "@data/repositories/requirement/requirement.repository.interface";
import { UserRepository } from "@data/repositories/user/user.repository";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { IRoleRepository } from "@data/repositories/role/role.repository.interface";
import { RoleRepository } from "@data/repositories/role/role.repository";
import { createAndSaveItemRequirement } from "../../../common/item-requirement.helper";
import { createAndSavePosting } from "../../../common/post.helper";
import { createAndSaveUser } from "../../../common/user.helper";
import { createAndSaveRole } from "../../../common/role.helper";

class PostRepositoryTestObject {
  user: { username: string };
  role: { name: string; class: string };
  requirement: { name: string; quantity: number };

  constructor() {
    this.user = { username: "username" };
    this.role = { name: "any", class: "any" };
    this.requirement = { name: "Some Item", quantity: 1 };
  }
}

describe("TypeORM posting repository tests", () => {
  let connection: Connection;
  let postRepository: IPostRepository;
  let userRepository: IUserRepository;
  let roleRepository: IRoleRepository;
  let requirementRepository: IRequirementRepository;

  let obj = new PostRepositoryTestObject();

  beforeAll(async () => {
    connection = await loadTypeORM();

    postRepository = connection.getCustomRepository(PostRepository);
    userRepository = connection.getCustomRepository(UserRepository);
    requirementRepository = connection.getCustomRepository(
      RequirementRepository
    );
    roleRepository = connection.getCustomRepository(RoleRepository);
  });

  afterEach(async () => {
    await requirementRepository.delete();
    await roleRepository.delete();
    await postRepository.delete();
    await userRepository.delete();

    resetTestObject();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should save posting in database", async () => {
    const { post } = await seedDb();

    const postingInDb = await postRepository.findOne({
      where: { id: post.id },
    });

    expect(postingInDb).not.toBeUndefined();
  });

  it("should save author relationship", async () => {
    const { post, author } = await seedDb();

    const postingInDb = await postRepository.findOne({
      where: { id: post.id },
    });

    expect(postingInDb?.author.id).toBe(author.id);
  });

  it("should save requirements relationship", async () => {
    const { post } = await seedDb();

    const postInDb = await postRepository.findOne({
      where: { id: post.id },
    });

    expect(postInDb?.requirements.length).toBe(1);
  });

  describe("relation properties", () => {
    it("should find post by role name", async () => {
      const roleName = "dps";
      setRoleName(roleName);
      const { post } = await seedDb();

      const postFound = await postRepository.findOne({
        where: { role: { name: roleName } },
      });

      expect(postFound).toBeDefined();
      expect(postFound).toHaveProperty("id", post.id);
    });

    it("should find post if it contains either of the roles", async () => {
      setRoleName("any");
      const { post } = await seedDb();

      const postFound = await postRepository.findOne({
        where: { role: { name: ["dps", "any"] } },
      });

      expect(postFound).toBeDefined();
      expect(postFound).toHaveProperty("id", post.id);
    });

    it("should not find post if role name differs", async () => {
      setRoleName("dps");
      await seedDb();

      const postFound = await postRepository.findOne({
        where: { role: { name: "heal" } },
      });

      expect(postFound).toBeUndefined();
    });
  });

  function resetTestObject() {
    obj = new PostRepositoryTestObject();
  }
  function setUsername(username: string) {
    obj.user.username = username;
  }
  function setRoleName(roleName: string) {
    obj.role.name = roleName;
  }
  function setRoleClass(roleClass: string) {
    obj.role.class = roleClass;
  }

  async function seedDb() {
    const [author, role, requirement] = await Promise.all([
      createAndSaveUser(userRepository, {
        username: obj.user.username,
      }),
      createAndSaveRole(roleRepository, {
        ...obj.role,
      }),
      createAndSaveItemRequirement(requirementRepository, {
        ...obj.requirement,
      }),
    ]);

    const post = await createAndSavePosting(postRepository, {
      author,
      roles: [role],
      requirements: [requirement],
    });

    return { author, role, post };
  }
});
