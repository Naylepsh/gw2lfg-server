import { UserMemoryRepository } from "../../helpers/repositories/user.memory-repository";
import { createAndSaveUser } from "../../helpers/user.helper";

describe("whatever", () => {
  it("should pass", async () => {
    const repo = new UserMemoryRepository();
    const user = await createAndSaveUser(repo, { username: "test" });
    await repo.save({ ...user, username: "new username" });

    expect(repo.entities.length).toBe(1);
  });
});
