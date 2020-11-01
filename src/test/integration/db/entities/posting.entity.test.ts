import { Connection, Repository } from "typeorm";
import { Posting } from "../../../../entities/posting.entity";
import {
  LIRequirement,
  Requirement,
} from "../../../../entities/requirement.entity";
import { User } from "../../../../entities/user.entity";
import { loadTypeORM } from "../../../../loaders/typeorm";

describe("TypeOrm posting entity tests", () => {
  let connection: Connection;
  let postingRepository: Repository<Posting>;
  let userRepository: Repository<User>;
  let requirementRepository: Repository<Requirement>;

  beforeAll(async () => {
    connection = await loadTypeORM();
    postingRepository = connection.getRepository(Posting);
    userRepository = connection.getRepository(User);
    requirementRepository = connection.getRepository(Requirement);
  });

  afterEach(async () => {
    await postingRepository.delete({});
    await userRepository.delete({});
    await requirementRepository.delete({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should allow omitting the optional parameters", async () => {
    const author = await createUser("username");
    const posting = await createPosting(author);

    const postingInDb = await postingRepository.findOne(posting.id);

    expect(postingInDb).not.toBeUndefined();
    expect(postingInDb!.description).toBeNull();
    expect(postingInDb!.requirements).toBeUndefined();
  });

  it("should save user relationship", async () => {
    const author = await createUser("username");
    const posting = await createPosting(author);

    const postingInDb = await postingRepository.findOne(posting.id, {
      relations: ["author"],
    });

    expect(postingInDb?.author.id).toBe(author.id);
  });

  it("should save requirements relationship", async () => {
    const author = await createUser("username");
    const requirement = await createLiRequirement(10);
    const posting = await createPosting(author, [requirement]);

    const postingInDb = await postingRepository.findOne(posting.id, {
      relations: ["requirements"],
    });

    expect(postingInDb?.requirements.length).toBe(1);
  });

  const createUser = (
    username: string,
    password: string = "password",
    apiKey: string = "api-key"
  ) => {
    const author = new User(username, password, apiKey);
    return userRepository.save(author);
  };

  const createLiRequirement = (quantity: number) => {
    const req = new LIRequirement(quantity);
    return requirementRepository.save(req);
  };

  const createPosting = (
    author: User,
    requirements: Requirement[] = [],
    date: Date = new Date(),
    server: string = "EU"
  ) => {
    const reqs = requirements ? requirements : undefined;
    const posting = new Posting(author, date, server, { requirements: reqs });
    return postingRepository.save(posting);
  };
});
