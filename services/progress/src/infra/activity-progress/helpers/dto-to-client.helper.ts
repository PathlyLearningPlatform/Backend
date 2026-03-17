import { ActivityProgressDto } from '@/app/activity-progress';
import { ActivityProgress as ClientActivityProgress } from '@pathly-backend/contracts/progress/v1/activities.js';

export function activityProgressDtoToClient(
	dto: ActivityProgressDto,
): ClientActivityProgress {
	return {
		id: dto.id,
		activityId: dto.activityId,
		completedAt: dto.completedAt?.toISOString() ?? '',
		lessonId: dto.lessonId,
		userId: dto.userId,
	};
}
