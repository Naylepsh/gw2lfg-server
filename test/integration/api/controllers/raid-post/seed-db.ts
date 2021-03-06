import items from "@services/gw2-api/items/items.json";
import { createToken } from "@root/api/utils/token/jwt";
import { RaidBoss } from "@root/data/entities/raid-boss/raid-boss.entity";
import { User } from "@root/data/entities/user/user.entity";
import { CreateRaidPostService } from "@root/services/raid-post/create-raid-post.service";
import { RegisterService } from "@root/services/user/register.service";
import { RaidPostMemoryUnitOfWork } from "../../../../common/uows/raid-post.memory-unit-of-work";
import { addHours } from "../../../../common/hours.util";
import { NotificationMemoryRepository } from "../../../../common/repositories/notification.memory-repository";
import { CreateNotificationService } from "@services/notification/create-notification.service";

export async function seedDbWithOnePost(uow: RaidPostMemoryUnitOfWork) {
  const registerService = new RegisterService(uow.users);
  const user = new User({
    username: "existingUser",
    password: "password",
    apiKey: "api-key",
  });
  const savedUser = await registerService.register(user);
  const token = createToken(savedUser.id);

  const boss = new RaidBoss({ name: "boss", isCm: false });
  const savedBoss = await uow.raidBosses.save(boss);
  const bossesIds = [savedBoss.id];

  const notificationRepo = new NotificationMemoryRepository();
  const notificationService = new CreateNotificationService(notificationRepo);
  const publishService = new CreateRaidPostService(
    uow,
    uow.users,
    notificationService
  );

  const item = Object.keys(items)[0];
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
  const post = await publishService.create(dto);

  return { token, bossesIds, post, user: savedUser };
}
