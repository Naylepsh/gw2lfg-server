import { Notification } from "@data/entities/notification/notification.entity";
import { JoinRequest } from "@data/entities/join-request/join-request.entity";

/**
 * Notification to send to the event's author when an user cancels their join request to author's event
 */
export class UserCanceledRequestNotification extends Notification {
  constructor(request: JoinRequest) {
    const text = `User#${request.user.id} canceled their request to join your post#${request.post.id}`;
    super({ text, recipent: request.post.author.username });
  }
}

/**
 * Notification to send to the event's author when an user cancels their accepted join request to author's event
 */
export class UserLeftYourEventNotification extends Notification {
  constructor(request: JoinRequest) {
    const text = `user#${request.user.id} left your post#${request.post.id}`;
    super({ text, recipent: request.post.author.username });
  }
}

/**
 * Notification to send to the request's author when the event's author declines a join request
 */
export class UserDeclinedYourRequestNotification extends Notification {
  constructor(request: JoinRequest) {
    const text = `user#${request.post.author.id} declined your join request to #post${request.post.id}`;
    super({ text, recipent: request.user.username });
  }
}

/**
 * Notification to send to the event's author when they kick an user from the event
 */
export class UserKickedYouFromEventNotification extends Notification {
  constructor(request: JoinRequest) {
    const text = `user#${request.post.author.id} kicked you from post#${request.post.id}`;
    super({ text, recipent: request.user.username });
  }
}

/**
 * Notification to send to the user when they cancel their pending join request
 */
export class YouCanceledRequestNotification extends Notification {
  constructor(request: JoinRequest) {
    const text = `You've canceled your join request to the post#${request.post.id}`;
    super({ text, recipent: request.user.username });
  }
}

/**
 * Notification to send to the user when they cancel their accepted join request
 */
export class YouLeftTheEventNotification extends Notification {
  constructor(request: JoinRequest) {
    const text = `You've left the post#${request.post.id}`;
    super({ text, recipent: request.user.username });
  }
}

/**
 * Notification to send to the request's author when the event's author declines a join request
 */
export class YouDeclinedRequestNotification extends Notification {
  constructor(request: JoinRequest) {
    const text = `You've declined user#${request.user} request to join post#${request.post.id}`;
    super({ text, recipent: request.user.username });
  }
}

/**
 * Notification to send to the event's author when they kick an user from the event
 */
export class YouKickedUserNotification extends Notification {
  constructor(request: JoinRequest) {
    const text = `You've kicked user#${request.user} from post#${request.post.id}`;
    super({ text, recipent: request.user.username });
  }
}
