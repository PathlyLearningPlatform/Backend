import type { LessonDto, LessonProgressDto } from '@/app/lessons/dtos';
import type { LessonProgressResponseDto, LessonResponseDto } from '../dtos';

export function clientLessonToResponseDto(
	lesson: LessonDto,
): LessonResponseDto {
	return {
		id: lesson.id,
		name: lesson.name,
		activityCount: lesson.activityCount,
		createdAt: lesson.createdAt.toISOString(),
		order: lesson.order,
		unitId: lesson.unitId,
		description: lesson.description,
		updatedAt: lesson.updatedAt ? lesson.updatedAt.toISOString() : null,
	};
}

export function clientLessonProgressToResponseDto(
	progress: LessonProgressDto,
): LessonProgressResponseDto {
	return {
		lessonId: progress.lessonId,
		unitId: progress.unitId,
		userId: progress.userId,
		completedAt: progress.completedAt?.toISOString() ?? null,
		totalActivityCount: progress.totalActivityCount,
		completedActivityCount: progress.completedActivityCount,
	};
}
