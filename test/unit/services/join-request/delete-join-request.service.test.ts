import { ItemRequirement } from "@data/entities/item-requirement/item.requirement.entity";
import { RaidPost } from "@data/entities/raid-post/raid-post.entitity";
import { Role } from "@data/entities/role/role.entity";
import { User } from "@data/entities/user/user.entity";
import { IPostRepository } from "@data/repositories/post/post.repository.interface";
import { IRoleRepository } from "@data/repositories/role/role.repository.interface";
import { IUserRepository } from "@data/repositories/user/user.repository.interface";
import { nameToId } from "@services/gw2-api/items/item.utils";
import items from "@services/gw2-api/items/items.json";
import { addHours } from "../../../common/hours.util";
import { JoinRequestMemoryRepository } from "../../../common/repositories/join-request.memory-repository";
import { NotificationMemoryRepository } from "../../../common/repositories/notification.memory-repository";
import { RaidPostMemoryRepository } from "../../../common/repositories/raid-post.memory-repository";
import { RoleMemoryRepository } from "../../../common/repositories/role.memory-repository";
import { UserMemoryRepository } from "../../../common/repositories/user.memory-repository";
import { INotificationRepository } from "@data/repositories/notification/notification.repository.interface";
import { CreateNotificationService } from "@services/notification/create-notification.service";
import { DeleteJoinRequestService } from "@services/join-request/delete-join-request.service";
import { JoinRequest } from "@data/entities/join-request/join-request.entity";

class JoinRequestServiceTestObject {
  date: Date;
  item: {
    name: string;
    quantity: number;
  };
  role: {
    name: string;
    class: string;
  };
  itemsInStorage: {
    id: number;
    count: number;
  }[];

  constructor() {
    const validItemName = Object.keys(items)[0];
    this.date = addHours(new Date(), 1);
    this.item = { name: validItemName, quantity: 1 };
    this.role = { name: "Any", class: "Any" };
    this.itemsInStorage = [{ id: nameToId(validItemName), count: 1 }];
  }
}

describe("CreateJoinRequest service tests", () => {
  let userRepo: IUserRepository;
  let roleRepo: IRoleRepository;
  let postRepo: IPostRepository;
  let joinRequestRepo: JoinRequestMemoryRepository;
  let notificationRepo: INotificationRepository;
  let service: DeleteJoinRequestService;
  let joinRequest: JoinRequest;
  let post: RaidPost;

  let obj = new JoinRequestServiceTestObject();

  beforeEach(async () => {
    resetTestObject();
    userRepo = new UserMemoryRepository();
    roleRepo = new RoleMemoryRepository();
    postRepo = new RaidPostMemoryRepository();
    joinRequestRepo = new JoinRequestMemoryRepository();
    notificationRepo = new NotificationMemoryRepository();

    ({ joinRequest, post } = await seed());

    const notificationService = new CreateNotificationService(notificationRepo);
    service = new DeleteJoinRequestService(
      joinRequestRepo,
      notificationService
    );
  });

  it("should notify join request author", async () => {
    await service.delete({
      id: joinRequest.id,
      deletionAuthorId: joinRequest.user.id,
    });

    const notifications = await notificationRepo.findMany({
      where: { recipent: joinRequest.user.username },
    });
    expect(notifications.length).toBeGreaterThan(0);
  });

  it("should notify join the author the post the join requst points to", async () => {
    await service.delete({
      id: joinRequest.id,
      deletionAuthorId: post.author.id,
    });

    const notifications = await notificationRepo.findMany({
      where: { recipent: post.author.username },
    });
    expect(notifications.length).toBeGreaterThan(0);
  });

  function resetTestObject() {
    obj = new JoinRequestServiceTestObject();
  }

  async function seed() {
    const apiKey = "api-key";
    const postAuthor = new User({
      username: "username",
      password: "password",
      apiKey,
    });
    await userRepo.save(postAuthor);

    const itemRequirement = new ItemRequirement(obj.item);
    const role = await roleRepo.save(new Role(obj.role));
    const post = new RaidPost({
      date: obj.date,
      server: "EU",
      author: postAuthor,
      bosses: [],
      requirements: [itemRequirement],
      roles: [role],
    });
    await postRepo.save(post);

    const requestAuthor = await userRepo.save(
      new User({
        username: "username2",
        password: "password",
        apiKey,
      })
    );
    const joinRequest = await joinRequestRepo.save(
      new JoinRequest({ role, post, user: requestAuthor })
    );

    return { post, itemRequirement, role, requestAuthor, joinRequest };
  }
});
