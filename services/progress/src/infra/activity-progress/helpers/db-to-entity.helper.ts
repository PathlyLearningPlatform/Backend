import { ActivityProgress } from '@/domain/activity-progress/entities';
import { DbActivityProgress } from '@infra/common/modules/db/types';

export function dbActivityProgressToEntity(db: DbActivityProgress) {
	return new ActivityProgress({
		activityId: db.activityId,
		id: db.id,
		userId: db.userId,
		completedAt: db.completedAt,
		lessonId: db.lessonId,
	});
}
