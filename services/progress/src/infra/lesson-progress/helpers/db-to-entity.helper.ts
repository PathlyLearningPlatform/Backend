import { LessonProgress } from '@/domain/lesson-progress/entities';
import { DbLessonProgress } from '@infra/common/modules/db/types';

export function dbLessonProgressToEntity(db: DbLessonProgress) {
	return new LessonProgress({
		id: db.id,
		userId: db.userId,
		lessonId: db.lessonId,
		completedActivityCount: db.completedActivityCount,
		completedAt: db.completedAt,
		totalActivityCount: db.totalActivityCount,
	});
}
