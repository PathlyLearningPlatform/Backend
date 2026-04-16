import { Section, SectionProgress } from '@/domain/sections';
import type { SectionDto, SectionProgressDto } from './dtos';

export function aggregateToDto(aggregate: Section): SectionDto {
	return {
		id: aggregate.id.value,
		learningPathId: aggregate.learningPathId.toString(),
		name: aggregate.name.value,
		description: aggregate.description?.value ?? null,
		createdAt: aggregate.createdAt,
		updatedAt: aggregate.updatedAt,
		order: aggregate.order.value,
		unitCount: aggregate.unitCount,
	};
}

export function progressAggregateToDto(
	aggregate: SectionProgress,
): SectionProgressDto {
	return {
		sectionId: aggregate.sectionId.value,
		learningPathId: aggregate.learningPathId.toString(),
		userId: aggregate.userId.toString(),
		completedAt: aggregate.completedAt,
		totalUnitCount: aggregate.totalUnitCount,
		completedUnitCount: aggregate.completedUnitCount,
	};
}
