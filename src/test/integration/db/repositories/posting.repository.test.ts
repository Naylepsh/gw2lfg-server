import { Connection } from "typeorm";
import { Posting } from "../../../../entities/posting.entity";
import { Requirement } from "../../../../entities/requirement.entity";
import { User } from "../../../../entities/user.entity";
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

type CreateAndSaveUser = (
  username: string,
  password?: string,
  apiKey?: string
) => Promise<User>;

const createAndSaveUserWithRepository = (
  repository: IUserRepository
): CreateAndSaveUser => (
  username: string,
  password: string = "password",
  apiKey: string = "api-key"
) => {
  const author = new User(username, password, apiKey);
  return repository.save(author);
};

type CreateAndSavePosting = (
  author: User,
  requirements?: Requirement[],
  date?: Date,
  server?: string
) => Promise<Posting>;

const createAndSavePostingWithRepository = (
  repository: IPostingRepository
): CreateAndSavePosting => (
  author: User,
  requirements: Requirement[] = [],
  date: Date = new Date(),
  server: string = "EU"
) => {
  const reqs = requirements ? requirements : undefined;
  const posting = new Posting(author, date, server, { requirements: reqs });
  return repository.save(posting);
};

describe("TypeORM posting repository tests", () => {
  let connection: Connection;
  let postingRepository: IPostingRepository;
  let userRepository: IUserRepository;
  let requirementRepository: IRequirementRepository;
  let createAndSaveUser: CreateAndSaveUser;
  let createAndSavePosting: CreateAndSavePosting;

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
});
