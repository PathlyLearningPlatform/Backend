import { ActivityProgress } from '@/domain/activity-progress/entities';
import { ActivityProgress as ClientActivityProgress } from '@pathly-backend/contracts/progress/v1/activities.js';

export function activityProgressToClient(
	entity: ActivityProgress,
): ClientActivityProgress {
	return {
		activityId: entity.activityId,
		completedAt:
			entity.completedAt === null ? '' : entity.completedAt.toISOString(),
		id: entity.id,
		userId: entity.userId,
		lessonId: entity.lessonId,
	};
}
