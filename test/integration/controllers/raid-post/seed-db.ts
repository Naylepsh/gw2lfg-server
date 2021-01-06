import items from "@services/gw2-items/items.json";
import { CreateJwtService } from "@api/services/token/create";
import { RaidBoss } from "@root/data/entities/raid-boss/raid-boss.entity";
import { User } from "@root/data/entities/user/user.entity";
import { PublishRaidPostService } from "@root/services/raid-post/publish-raid-posts.service";
import { RegisterService } from "@root/services/user/register.service";
import { RaidPostMemoryUnitOfWork } from "../../../helpers/uows/raid-post.memory-unit-of-work";
import { addHours } from "../../../unit/services/raid-post/hours.util";
import { FakeApiKeyChecker } from "../../../unit/services/fake-api-key-checker";

export async function seedDbWithOnePost(uow: RaidPostMemoryUnitOfWork) {
  const apiKeyChecker = new FakeApiKeyChecker(true);
  const registerService = new RegisterService(uow.users, apiKeyChecker);
  const user = new User({
    username: "existingUser",
    password: "password",
    apiKey: "api-key",
  });
  const savedUser = await registerService.register(user);
  const token = new CreateJwtService().createToken(savedUser.id);

  const boss = new RaidBoss({ name: "boss", isCm: false });
  const savedBoss = await uow.raidBosses.save(boss);
  const bossesIds = [savedBoss.id];

  const item = Object.keys(items)[0];
  const publishService = new PublishRaidPostService(uow);
  const dto = {
    server: "EU",
    date: addHours(new Date(), 12),
    bossesIds,
    rolesProps: [
      { name: "DPS", class: "Any", description: "condi, not scourge" },
    ],
    requirementsProps: { itemsProps: [{ name: item, quantity: 10 }] },
    authorId: savedUser.id,
  };
  const post = await publishService.publish(dto);
  return { token, bossesIds, post, user: savedUser };
}
