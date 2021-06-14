import { Post } from "@data/entities/post/post.entity";
import { Notification } from "@data/entities/notification/notification.entity";

/**
 * Notification to send to the recipent when they created a raid post
 */
export class YouCreatedRaidPostNotification extends Notification {
  constructor(post: Post) {
    const text = `You've created the post#${post.id}`;
    super({ text, recipent: post.author.username });
  }
}
