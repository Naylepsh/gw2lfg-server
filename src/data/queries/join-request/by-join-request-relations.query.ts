export interface JoinRequestRelationParams {
  userId?: number;
  postId?: number;
  roleId?: number;
}

export function byJoinRequestRelations(params: JoinRequestRelationParams) {
  const { userId, postId, roleId } = params;

  const where: Record<string, { id: number }> = {};
  if (userId) {
    where.user = { id: userId };
  }
  if (postId) {
    where.post = { id: postId };
  }
  if (roleId) {
    where.role = { id: roleId };
  }

  return { where };
}
