import { User } from "@root/data/entities/user/user.entity";
import { ICheckRequirementsService } from "@services/requirement/check-requirements.service.interface";
import { RaidPost } from "@root/data/entities/raid-post/raid-post.entitity";

// checks if user meets posts' requirements using requirementsCheckService
export async function checkIfUserMeetsPostsRequirements(
  posts: RaidPost[],
  user: User,
  requirementsCheckService: ICheckRequirementsService
) {
  const satisfiesRequirements = await requirementsCheckService.areRequirementsSatisfied(
    posts,
    user
  );

  const _posts = posts.map((post, index) => ({
    ...post,
    userMeetsRequirements: satisfiesRequirements[index],
  }));

  return _posts;
}
