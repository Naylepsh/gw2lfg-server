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
import { IJoinRequestRepository } from "@data/repositories/join-request/join-request.repository.interface";
import { JoinRequestRepository } from "@data/repositories/join-request/join-request.repository";
import { JoinRequest } from "@data/entities/join-request/join-request.entity";

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
  let joinRequestRepository: IJoinRequestRepository;

  let obj = new PostRepositoryTestObject();

  beforeAll(async () => {
    connection = await loadTypeORM();

    postRepository = connection.getCustomRepository(PostRepository);
    userRepository = connection.getCustomRepository(UserRepository);
    requirementRepository = connection.getCustomRepository(
      RequirementRepository
    );
    roleRepository = connection.getCustomRepository(RoleRepository);
    joinRequestRepository = connection.getCustomRepository(
      JoinRequestRepository
    );
  });

  afterEach(async () => {
    await joinRequestRepository.delete({});
    await requirementRepository.delete({});
    await roleRepository.delete({});
    await postRepository.delete({});
    await userRepository.delete({});

    resetTestObject();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should save post in database", async () => {
    const { post } = await seedDb();

    const postingInDb = await postRepository.findOne({
      where: { id: post.id },
    });

    expect(postingInDb).not.toBeUndefined();
  });

  it("should find by ids", async () => {
    const { post: post1 } = await seedDb();
    setUsername("username2");
    const { post: post2 } = await seedDb();
    setUsername("username3");
    const { post: post3 } = await seedDb();

    const posts = await postRepository.findMany({
      where: { id: [post1.id, post2.id] },
    });
    const ids = posts.map((post) => post.id);

    expect(ids).toContain(post1.id);
    expect(ids).toContain(post2.id);
    expect(ids).not.toContain(post3.id);
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

    it("should find post by join request status", async () => {
      const { post, role, author } = await seedDb();
      const request = new JoinRequest({ post, role, user: author });
      request.status = "ACCEPTED";
      await joinRequestRepository.save(request);

      const postFound = await postRepository.findOne({
        where: { joinRequest: { status: "ACCEPTED" } },
      });

      expect(postFound).toBeDefined();
    });

    it("should not find any posts by join request status not attached to any posts", async () => {
      await seedDb();

      const postFound = await postRepository.findOne({
        where: { joinRequest: { status: "ACCEPTED" } },
      });

      expect(postFound).toBeUndefined();
    });

    it("should find post by join request author", async () => {
      const { post, role, author } = await seedDb();
      const request = new JoinRequest({ post, role, user: author });
      await joinRequestRepository.save(request);

      const postFound = await postRepository.findOne({
        where: { joinRequest: { authorId: request.user.id } },
      });

      expect(postFound).toBeDefined();
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
