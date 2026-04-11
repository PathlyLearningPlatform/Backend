import type { LessonDto } from '@/app/lessons/dtos';
import type { LessonResponseDto } from '../dtos';

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
