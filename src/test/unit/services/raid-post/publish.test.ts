import { RaidBoss } from "../../../../entities/raid-boss.entity";
import { RaidPost } from "../../../../entities/raid-post.entitity";
import { publish } from "../../../../services/raid-post/publish";
import { RaidBossMemoryRepository } from "../../../helpers/repositories/raid-boss.memory-repository";
import { RaidPostMemoryRepository } from "../../../helpers/repositories/raid-post.memory-repository";
import { RequirementMemoryRepository } from "../../../helpers/repositories/requirement.memory-repository";
import { RoleMemoryRepository } from "../../../helpers/repositories/role.memory-repository";
import { UserMemoryRepository } from "../../../helpers/repositories/user.memory-repository";
import { createUser } from "../../../helpers/user.helper";

const addHours = (date: Date, hours: number) => {
  const copy = new Date(date);
  copy.setTime(copy.getTime() + hours * 60 * 60 * 1000);
  return copy;
};

const subtractHours = (date: Date, hours: number) => {
  return addHours(date, -hours);
};

describe("RaidPost service: publish tests", () => {
  it("should save a post when valid data was passed", async () => {
    const user = createUser({ username: "username" });
    const bosses = [new RaidBoss({ name: "boss", isCm: false })];
    const post = new RaidPost({
      author: user,
      date: addHours(new Date(), 1),
      server: "EU",
      bosses,
    });
    const raidPostRepository = new RaidPostMemoryRepository();
    const userRepository = new UserMemoryRepository();
    const requirementRepository = new RequirementMemoryRepository();
    const roleRepository = new RoleMemoryRepository();
    const bossRepository = new RaidBossMemoryRepository();

    const { id } = await publish(
      post,
      raidPostRepository,
      userRepository,
      requirementRepository,
      roleRepository,
      bossRepository
    );
    const hasBeenSaved = !!(await raidPostRepository.findById(id));

    expect(hasBeenSaved).toBe(true);
  });

  it("should fail when a post date is in the past", async () => {
    const user = createUser({ username: "username" });
    const bosses = [new RaidBoss({ name: "boss", isCm: false })];
    const post = new RaidPost({
      author: user,
      date: subtractHours(new Date(), 1),
      server: "EU",
      bosses,
    });
    const raidPostRepository = new RaidPostMemoryRepository();
    const userRepository = new UserMemoryRepository();
    const requirementRepository = new RequirementMemoryRepository();
    const roleRepository = new RoleMemoryRepository();
    const bossRepository = new RaidBossMemoryRepository();

    expect(
      publish(
        post,
        raidPostRepository,
        userRepository,
        requirementRepository,
        roleRepository,
        bossRepository
      )
    ).rejects.toThrow();
  });
});
