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
import {
  CreateAndSaveLIRequirement,
  createAndSaveLIRequirementWithRepository,
} from "./li-requirement.helper";
import {
  CreateAndSavePosting,
  createAndSavePostingWithRepository,
} from "./posting.helper";
import {
  CreateAndSaveUser,
  createAndSaveUserWithRepository,
} from "./user.helper";

describe("TypeORM posting repository tests", () => {
  let connection: Connection;
  let postingRepository: IPostingRepository;
  let userRepository: IUserRepository;
  let requirementRepository: IRequirementRepository;
  let createAndSaveUser: CreateAndSaveUser;
  let createAndSavePosting: CreateAndSavePosting;
  let createAndSaveLiRequirement: CreateAndSaveLIRequirement;

  beforeAll(async () => {
    connection = await loadTypeORM();

    postingRepository = connection.getCustomRepository(PostingRepository);
    userRepository = connection.getCustomRepository(UserRepository);
    requirementRepository = connection.getCustomRepository(
      RequirementRepository
    );

    createAndSaveUser = createAndSaveUserWithRepository(userRepository);
    createAndSavePosting = createAndSavePostingWithRepository(
      postingRepository
    );
    createAndSaveLiRequirement = createAndSaveLIRequirementWithRepository(
      requirementRepository
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
    const author = await createAndSaveUser("username");
    const posting = await createAndSavePosting(author);

    const postingInDb = await postingRepository.findById(posting.id);

    expect(postingInDb).not.toBeUndefined();
  });

  it("should save author relationship", async () => {
    const author = await createAndSaveUser("username");
    const posting = await createAndSavePosting(author);

    const postingInDb = await postingRepository.findById(posting.id);

    expect(postingInDb?.author.id).toBe(author.id);
  });

  it("should save requirements relationship", async () => {
    const author = await createAndSaveUser("username");
    const requirement = await createAndSaveLiRequirement(10);
    const posting = await createAndSavePosting(author, [requirement]);

    const postingInDb = await postingRepository.findById(posting.id);

    expect(postingInDb?.requirements.length).toBe(1);
  });
});
