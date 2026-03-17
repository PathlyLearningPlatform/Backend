import type { LessonProgressDto } from '@/app/lesson-progress';
import type { LessonProgress as ClientLessonProgress } from '@pathly-backend/contracts/progress/v1/lessons.js';

export function lessonProgressDtoToClient(
	dto: LessonProgressDto,
): ClientLessonProgress {
	return {
		id: dto.id,
		lessonId: dto.lessonId,
		unitId: dto.unitId,
		userId: dto.userId,
		completedAt: dto.completedAt?.toISOString() ?? '',
		totalActivityCount: dto.totalActivityCount,
		completedActivityCount: dto.completedActivityCount,
	};
}
