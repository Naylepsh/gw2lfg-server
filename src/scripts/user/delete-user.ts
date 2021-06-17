import "module-alias/register"; // needed for usage of module aliases
import { loadTypeDI } from "../../loaders/typedi.loader";
import { loadTypeORM } from "../../loaders/typeorm.loader";
import Container from "typedi";
import { DeleteRaidPostService } from "../../services/raid-post/delete-raid-post.service";
import { loadEnv } from "../../config/env.utils";
import { User } from "../../data/entities/user/user.entity";
import { Notification } from "../../data/entities/notification/notification.entity";
import { JoinRequest } from "../../data/entities/join-request/join-request.entity";

const main = async () => {
  loadEnv();

  if (process.argv.length > 3) {
    console.log(
      "Missing id argument.\nSample API usage: yarn cli:raid-post:delete 42"
    );
    return;
  }

  const id = parseInt(process.argv[2]);
  if (Number.isNaN(id)) {
    console.log("Invalid argument type. Id should be an integer");
    return;
  }

  const conn = await loadTypeORM();
  loadTypeDI();

  try {
    const userRepo = conn.getRepository(User);
    const user = await userRepo.findOne({
      where: { id },
      relations: ["posts"],
    });
    if (!user) {
      return;
    }

    const service = Container.get(DeleteRaidPostService);
    await Promise.all(
      user.posts.map((post) => service.delete({ id: post.id }))
    );

    const joinRequestRepo = conn.getRepository(JoinRequest);
    await joinRequestRepo.delete({ user: { id } });

    const notificationRepo = conn.getRepository(Notification);
    await notificationRepo.delete({ recipent: user.username });

    await userRepo.delete({ id });

    console.log(`Successfully deleted user with id ${id}`);
  } catch (error) {
    throw error;
  } finally {
    await conn.close();
  }
};

main();
