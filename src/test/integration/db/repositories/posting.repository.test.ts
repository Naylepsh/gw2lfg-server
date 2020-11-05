import { Connection } from "typeorm";
import { loadTypeORM } from "../../../../loaders/typeorm";
import {
  IPostingRepository,
  PostingRepository,
} from "../../../../repositories/posting.repository";
import {
  IRequirementRepository,
  RequirementRepository,
} from "../../../../repositories/requirement.repository";
import {
  IUserRepository,
  UserRepository,
} from "../../../../repositories/user.repository";
import { createAndSaveLIRequirement } from "../../../helpers/li-requirement.helper";
import { createAndSavePosting } from "../../../helpers/posting.helper";
import { createAndSaveUser } from "../../../helpers/user.helper";

describe("TypeORM posting repository tests", () => {
  let connection: Connection;
  let postingRepository: IPostingRepository;
  let userRepository: IUserRepository;
  let requirementRepository: IRequirementRepository;

  beforeAll(async () => {
    connection = await loadTypeORM();

    postingRepository = connection.getCustomRepository(PostingRepository);
    userRepository = connection.getCustomRepository(UserRepository);
    requirementRepository = connection.getCustomRepository(
      RequirementRepository
    );
  });

  afterEach(async () => {
    await postingRepository.delete();
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
    const posting = await createAndSavePosting(postingRepository, { author });

    const postingInDb = await postingRepository.findById(posting.id);

    expect(postingInDb).not.toBeUndefined();
  });

  it("should save author relationship", async () => {
    const author = await createAndSaveUser(userRepository, {
      username: "username",
    });
    const posting = await createAndSavePosting(postingRepository, { author });

    const postingInDb = await postingRepository.findById(posting.id);

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
    const posting = await createAndSavePosting(postingRepository, {
      author,
      requirements: [requirement],
    });

    const postingInDb = await postingRepository.findById(posting.id);

    expect(postingInDb?.requirements.length).toBe(1);
  });
});
