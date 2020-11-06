import { Connection } from "typeorm";
import { loadTypeORM } from "../../../../loaders/typeorm";
import {
  IPostRepository,
  PostRepository,
} from "../../../../repositories/post.repository";
import {
  IRequirementRepository,
  RequirementRepository,
} from "../../../../repositories/requirement.repository";
import {
  IUserRepository,
  UserRepository,
} from "../../../../repositories/user.repository";
import { createAndSaveLIRequirement } from "../../../helpers/li-requirement.helper";
import { createAndSavePosting } from "../../../helpers/post.helper";
import { createAndSaveUser } from "../../../helpers/user.helper";

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
    await postRepository.delete();
    await userRepository.delete();
    await requirementRepository.delete();
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
    const requirement = await createAndSaveLIRequirement(
      requirementRepository,
      { quantity: 10 }
    );
    const post = await createAndSavePosting(postRepository, {
      author,
      requirements: [requirement],
    });

    const postInDb = await postRepository.findById(post.id);

    expect(postInDb?.requirements.length).toBe(1);
  });
});
