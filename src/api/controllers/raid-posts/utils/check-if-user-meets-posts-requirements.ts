import { User } from "@data/entities/user.entity";
import { ICheckRequirementsService } from "@services/requirement/check-requirements.service.interface";
import { RaidPost } from "@data/entities/raid-post.entitity";

export async function checkIfUserMeetsPostsRequirements(
  posts: RaidPost[],
  user: User,
  requirementsCheckService: ICheckRequirementsService
) {
  const satisfiesRequirements = await Promise.all(
    posts.map((post) =>
      requirementsCheckService.areRequirementsSatisfied(post.requirements, user)
    )
  );
  const _posts = posts.map((post, index) => ({
    ...post,
    userMeetsRequirements: satisfiesRequirements[index],
  }));

  return _posts;
}
