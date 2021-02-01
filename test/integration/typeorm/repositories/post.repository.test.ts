import { Connection } from "typeorm";
import { loadTypeORM } from "@loaders/typeorm.loader";
import { PostRepository } from "@data/repositories/post/post.repository";
import { IPostRepository } from "@data/repositories/post/post.repository.interface";
import { RequirementRepository } from "@data/repositories/requirement/requirement.repository";
import { IRequirementRepository } from "@data/repositories/requirement/requirement.repository.interface";
import { UserRepository } from "@data/repositories/user/user.repository";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { createAndSaveItemRequirement } from "../../../common/item-requirement.helper";
import { createAndSavePosting } from "../../../common/post.helper";
import { createAndSaveUser } from "../../../common/user.helper";

describe("TypeORM posting repository tests", () => {
  let connection: Connection;
  let postRepository: IPostRepository;
  let userRepository: IUserRepository;
  let requirementRepository: IRequirementRepository;

  beforeAll(async () => {
    connection = await loadTypeORM();

    postRepository = connection.getCustomRepository(PostRepository);
    userRepository = connection.getCustomRepository(UserRepository);
    requirementRepository = connection.getCustomRepository(
      RequirementRepository
    );
  });

  afterEach(async () => {
    await requirementRepository.delete();
    await postRepository.delete();
    await userRepository.delete();
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should save posting in database", async () => {
    const author = await createAndSaveUser(userRepository, {
      username: "username",
    });
    const post = await createAndSavePosting(postRepository, { author });

    const postingInDb = await postRepository.findById(post.id);

    expect(postingInDb).not.toBeUndefined();
  });

  it("should save author relationship", async () => {
    const author = await createAndSaveUser(userRepository, {
      username: "username",
    });
    const post = await createAndSavePosting(postRepository, { author });

    const postingInDb = await postRepository.findById(post.id);

    expect(postingInDb?.author.id).toBe(author.id);
  });

  it("should save requirements relationship", async () => {
    const author = await createAndSaveUser(userRepository, {
      username: "username",
    });
    const requirement = await createAndSaveItemRequirement(
      requirementRepository,
      { name: "Some Item", quantity: 10 }
    );
    const post = await createAndSavePosting(postRepository, {
      author,
      requirements: [requirement],
    });

    const postInDb = await postRepository.findById(post.id);

    expect(postInDb?.requirements.length).toBe(1);
  });
});
