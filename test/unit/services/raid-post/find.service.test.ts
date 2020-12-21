import { createAndSaveRaidPost } from "../../../helpers/raid-post.helper";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { createAndSaveUser } from "../../../helpers/user.helper";
import { FindRaidPostService } from "@services/raid-post/find.service";
import { addHours } from "./hours.util";

describe("RaidPosts Service: find tests", () => {
  const uow = RaidPostMemoryUnitOfWork.create();
  const service = new FindRaidPostService(uow.raidPosts);
  const numberOfPosts = 10;

  beforeEach(async () => {
    const user = await createAndSaveUser(uow.users, { username: "username" });
    await Promise.all(
      [...Array(numberOfPosts).keys()].map((_) =>
        createAndSaveRaidPost(uow.raidPosts, user, {
          date: addHours(new Date(), 1),
        })
      )
    );
  });

  afterEach(async () => {
    await uow.deleteAll();
  });

  it("should return expected number of posts if there are still more posts to find", async () => {
    const params = { skip: 0, take: numberOfPosts - 1 };

    const { posts } = await service.find(params);

    expect(posts.length).toBe(params.take);
  });

  it("should set hasMore to true if there are still more posts to find", async () => {
    const params = { skip: 0, take: numberOfPosts - 1 };

    const { hasMore } = await service.find(params);

    expect(hasMore).toBe(true);
  });

  it("should set hasMore to false if found all the posts", async () => {
    const params = { skip: 0, take: numberOfPosts + 1 };

    const { hasMore } = await service.find(params);

    expect(hasMore).toBe(false);
  });
});
