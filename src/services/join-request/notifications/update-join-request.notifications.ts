import { JoinRequest } from "@data/entities/join-request/join-request.entity";
import { Notification } from "@data/entities/notification/notification.entity";

/**
 * Notification to send to the recipent when an user accepts their join request to the user's group
 */
export class UserAcceptedRequestNotification extends Notification {
  constructor(request: JoinRequest) {
    const text = `User#${request.post.author.id} accepted your request to join their post#${request.post.id}`;
    super({ text, recipent: request.user.username });
  }
}

/**
 * Notification to send to the recipent when they accept a join request
 */
export class YouAcceptedRequestNotification extends Notification {
  constructor(request: JoinRequest) {
    const text = `You've accepted the request of user#${request.user.id} to join your post#${request.post.id}`;
    super({ text, recipent: request.post.author.username });
  }
}
