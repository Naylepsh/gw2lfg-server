import { JoinRequest } from "@data/entities/join-request/join-request.entity";
import { User } from "@data/entities/user/user.entity";
import { Notification } from "@data/entities/notification/notification.entity";

/**
 * Notification to send to the recipent when an user sends a join request to recipent's group
 */
export class UserWantsToJoinNotification extends Notification {
  constructor(request: JoinRequest, recipent: User) {
    const text = `User#${request.user.id} wants to join your post#${request.post.id}`;
    super({ text, recipent: recipent.username });
  }
}

/**
 * Notification to send to the recipent when they send a join request
 */
export class YouSentRequestNotification extends Notification {
  constructor(request: JoinRequest) {
    const text = `You've sent a join request to the post#${request.post.id}`;
    super({ text, recipent: request.user.username });
  }
}
