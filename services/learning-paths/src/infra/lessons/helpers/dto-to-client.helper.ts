import type { LessonProgress as ClientLessonProgress } from '@pathly-backend/contracts/learning_paths/v1/lessons.js';
import type { Lesson } from '@pathly-backend/contracts/learning-paths/v1/lessons.js';
import type { LessonDto, LessonProgressDto } from '@/app/lessons/dtos';

export function lessonDtoToClient(dto: LessonDto): Lesson {
	return {
		id: dto.id,
		createdAt: dto.createdAt.toISOString(),
		updatedAt: dto.updatedAt?.toISOString() ?? '',
		name: dto.name,
		description: dto.description ?? '',
		order: dto.order,
		unitId: dto.unitId,
		activityCount: dto.activityCount,
	};
}

export function lessonProgressDtoToClient(
	dto: LessonProgressDto,
): ClientLessonProgress {
	return {
		lessonId: dto.lessonId,
		userId: dto.userId,
		completedAt: dto.completedAt?.toISOString() ?? '',
		totalActivityCount: dto.totalActivityCount,
		completedActivityCount: dto.completedActivityCount,
		unitId: dto.unitId,
	};
}
