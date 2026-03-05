import { LessonProgress } from '@/domain/lesson-progress/entities';
import { LessonProgress as ClientLessonProgress } from '@pathly-backend/contracts/progress/v1/lessons.js';

export function lessonProgressToClient(
	entity: LessonProgress,
): ClientLessonProgress {
	return {
		totalActivityCount: entity.totalActivityCount,
		completedActivityCount: entity.completedActivityCount,
		completedAt:
			entity.completedAt === null ? '' : entity.completedAt.toISOString(),
		id: entity.id,
		userId: entity.userId,
		lessonId: entity.lessonId,
	};
}
