import Container from "typedi";
import { DeleteOldPostsService } from "@services/raid-post/delete-old-posts.service";

/**
 * Loads scheduled tasks
 */
export const loadTasks = () => {
  // IMPORTANT!: delay has to be between 1 and 2147483647 or else it will be set to 1

  // run delete old posts every hour
  const everyHour = 1000 * 60 * 60;
  setInterval(async () => {
    try {
      const deletionService = Container.get(DeleteOldPostsService);
      await deletionService.deleteOldPosts();
      console.log("Successfully ran old posts deletion task");
    } catch (error) {
      console.log("Error during old post deletion scheduled task");
      console.log(error.message);
    }
  }, everyHour);
};
