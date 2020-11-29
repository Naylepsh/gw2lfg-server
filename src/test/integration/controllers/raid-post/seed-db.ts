import { RaidBoss } from "../../../../data/entities/raid-boss.entity";
import { User } from "../../../../data/entities/user.entity";
import { RegisterService } from "../../../../services/user/register";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { PublishRaidPostService } from "../../../../services/raid-post/publish.service";
import { addHours } from "../../../unit/services/raid-post/hours.util";

export async function seedDbWithOnePost(uow: RaidPostMemoryUnitOfWork) {
  const registerService = new RegisterService(uow.users);
  const author = new User({
    username: "existingUser",
    password: "password",
    apiKey: "api-key",
  });
  const { id: userid } = await registerService.register(author);
  const token = userid.toString();

  const boss = new RaidBoss({ name: "boss", isCm: false });
  const savedBoss = await uow.raidBosses.save(boss);
  const bossesIds = [savedBoss.id];

  const publishService = new PublishRaidPostService(uow);
  const dto = {
    server: "EU",
    date: addHours(new Date(), 12),
    bossesIds,
    rolesProps: [],
    requirementsProps: [],
    authorId: userid,
  };
  const post = await publishService.publish(dto);
  const postId = post.id;
  return { token, bossesIds, postId };
}
