import { Lesson, LessonProgress } from '@/domain/lessons';
import type { LessonDto, LessonProgressDto } from './dtos';

export function aggregateToDto(aggregate: Lesson): LessonDto {
	return {
		id: aggregate.id.value,
		unitId: aggregate.unitId.value,
		name: aggregate.name.value,
		description: aggregate.description?.value ?? null,
		createdAt: aggregate.createdAt,
		updatedAt: aggregate.updatedAt,
		order: aggregate.order.value,
		activityCount: aggregate.activityCount,
	};
}

export function progressAggregateToDto(
	aggregate: LessonProgress,
): LessonProgressDto {
	return {
		lessonId: aggregate.lessonId.value,
		unitId: aggregate.unitId.value,
		userId: aggregate.userId.toString(),
		completedAt: aggregate.completedAt,
		totalActivityCount: aggregate.totalActivityCount,
		completedActivityCount: aggregate.completedActivityCount,
	};
}
