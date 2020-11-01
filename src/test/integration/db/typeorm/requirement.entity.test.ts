import { Connection, Repository } from "typeorm";
import {
  LIRequirement,
  Requirement,
} from "../../../../entities/requirement.entity";
import { loadTypeORM } from "../../../../loaders/typeorm";

describe("TypeORM requirement entity tests", () => {
  let requirementRepository: Repository<Requirement>;
  let liRequirementRepository: Repository<LIRequirement>;
  let connection: Connection;

  beforeAll(async () => {
    connection = await loadTypeORM();
    requirementRepository = connection.getRepository(Requirement);
    liRequirementRepository = connection.getRepository(LIRequirement);
  });

  afterEach(async () => {
    await requirementRepository.delete({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should be accessible from base class repository", async () => {
    const quantity = 10;
    const liReq = new LIRequirement(quantity);
    await liRequirementRepository.save(liReq);

    const reqInDb = await requirementRepository.findOne(liReq.id);

    expect(reqInDb).not.toBeUndefined();
    expect(reqInDb).toHaveProperty("name", liReq.name);
  });
});
