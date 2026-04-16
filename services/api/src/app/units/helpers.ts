import { Unit, UnitProgress } from '@/domain/units';
import type { UnitDto, UnitProgressDto } from './dtos';

export function aggregateToDto(aggregate: Unit): UnitDto {
	return {
		id: aggregate.id.value,
		sectionId: aggregate.sectionId.value,
		name: aggregate.name.value,
		description: aggregate.description?.value ?? null,
		createdAt: aggregate.createdAt,
		updatedAt: aggregate.updatedAt,
		order: aggregate.order.value,
		lessonCount: aggregate.lessonCount,
	};
}

export function progressAggregateToDto(
	aggregate: UnitProgress,
): UnitProgressDto {
	return {
		unitId: aggregate.unitId.value,
		sectionId: aggregate.sectionId.value,
		userId: aggregate.userId.toString(),
		completedAt: aggregate.completedAt,
		totalLessonCount: aggregate.totalLessonCount,
		completedLessonCount: aggregate.completedLessonCount,
	};
}
