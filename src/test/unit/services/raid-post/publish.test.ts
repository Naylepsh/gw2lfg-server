import { LIRequirement } from "../../../../entities/requirement.entity";
import { publish, PublishDTO } from "../../../../services/raid-post/publish";
import { createAndSaveRaidBoss } from "../../../helpers/raid-boss.helper";
import { RaidBossMemoryRepository } from "../../../helpers/repositories/raid-boss.memory-repository";
import { RaidPostMemoryRepository } from "../../../helpers/repositories/raid-post.memory-repository";
import { RequirementMemoryRepository } from "../../../helpers/repositories/requirement.memory-repository";
import { RoleMemoryRepository } from "../../../helpers/repositories/role.memory-repository";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";
import { createAndSaveUser } from "../../../helpers/user.helper";

const addHours = (date: Date, hours: number) => {
  const copy = new Date(date);
  copy.setTime(copy.getTime() + hours * 60 * 60 * 1000);
  return copy;
};

const subtractHours = (date: Date, hours: number) => {
  return addHours(date, -hours);
};

describe("RaidPost service: publish tests", () => {
  const raidPostRepository = new RaidPostMemoryRepository();
  const userRepository = new UserMemoryRepository();
  const requirementRepository = new RequirementMemoryRepository();
  const roleRepository = new RoleMemoryRepository();
  const bossRepository = new RaidBossMemoryRepository();

  const publishPost = (post: PublishDTO) => {
    return publish(
      post,
      raidPostRepository,
      userRepository,
      requirementRepository,
      roleRepository,
      bossRepository
    );
  };

  afterEach(async () => {
    await raidPostRepository.delete({});
    await userRepository.delete({});
    await requirementRepository.delete({});
    await roleRepository.delete({});
    await bossRepository.delete({});
  });

  it("should save a post when valid data was passed", async () => {
    const { id: userId } = await createAndSaveUser(userRepository, {
      username: "username",
    });
    const { id: bossId } = await createAndSaveRaidBoss(bossRepository, {
      name: "boss",
      isCm: false,
    });
    const dto = {
      raidPostProps: {
        date: addHours(new Date(), 1),
        server: "EU",
      },
      authorId: userId,
      bossesIds: [bossId],
      rolesProps: [],
      requirementsProps: [{ name: LIRequirement.itemName, quantity: 10 }],
    };

    const { id: postId } = await publishPost(dto);
    const hasBeenSaved = !!(await raidPostRepository.findById(postId));

    expect(hasBeenSaved).toBe(true);
  });

  it("should save requirements when valid data was passed", async () => {
    const { id: userId } = await createAndSaveUser(userRepository, {
      username: "username",
    });
    const { id: bossId } = await createAndSaveRaidBoss(bossRepository, {
      name: "boss",
      isCm: false,
    });
    const dto = {
      raidPostProps: {
        date: addHours(new Date(), 1),
        server: "EU",
      },
      authorId: userId,
      bossesIds: [bossId],
      rolesProps: [],
      requirementsProps: [{ name: LIRequirement.itemName, quantity: 10 }],
    };
    const reqsInDbBefore = requirementRepository.entities.size;

    await publishPost(dto);

    const reqsInDbAfter = requirementRepository.entities.size;
    expect(reqsInDbAfter - reqsInDbBefore > 0).toBe(true);
  });

  it("should fail when a post date is in the past", async () => {
    const { id: userId } = await createAndSaveUser(userRepository, {
      username: "username",
    });
    const { id: bossId } = await createAndSaveRaidBoss(bossRepository, {
      name: "boss",
      isCm: false,
    });
    const dto = {
      raidPostProps: {
        date: subtractHours(new Date(), 1),
        server: "EU",
      },
      authorId: userId,
      bossesIds: [bossId],
      rolesProps: [],
      requirementsProps: [],
    };

    expect(publishPost(dto)).rejects.toThrow();
  });
});
