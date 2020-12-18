import { CreateJwtService } from "@api/services/token/create";
import { RaidBoss } from "@data/entities/raid-boss.entity";
import { LIRequirement } from "@data/entities/requirement.entity";
import { User } from "@data/entities/user.entity";
import { PublishRaidPostService } from "@services/raid-post/publish.service";
import { RegisterService } from "@services/user/register";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { addHours } from "../../../unit/services/raid-post/hours.util";

export async function seedDbWithOnePost(uow: RaidPostMemoryUnitOfWork) {
  const registerService = new RegisterService(uow.users);
  const user = new User({
    username: "existingUser",
    password: "password",
    apiKey: "api-key",
  });
  const { id: userId } = await registerService.register(user);
  const token = new CreateJwtService().createToken(userId);

  const boss = new RaidBoss({ name: "boss", isCm: false });
  const savedBoss = await uow.raidBosses.save(boss);
  const bossesIds = [savedBoss.id];

  const publishService = new PublishRaidPostService(uow);
  const dto = {
    server: "EU",
    date: addHours(new Date(), 12),
    bossesIds,
    rolesProps: [
      { name: "DPS", class: "Any", description: "condi, not scourge" },
    ],
    requirementsProps: [{ name: LIRequirement.itemName, quantity: 10 }],
    authorId: userId,
  };
  const post = await publishService.publish(dto);
  return { token, bossesIds, post, user };
}
