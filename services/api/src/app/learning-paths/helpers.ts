import { LearningPath, LearningPathProgress } from '@/domain/learning-paths';
import { LearningPathDto, LearningPathProgressDto } from './dtos';

export function aggregateToDto(aggregate: LearningPath): LearningPathDto {
	return {
		id: aggregate.id.toString(),
		createdAt: aggregate.createdAt,
		description: aggregate.description?.value ?? null,
		name: aggregate.name.value,
		sectionCount: aggregate.sectionCount,
		updatedAt: aggregate.updatedAt,
	};
}

export function progressAggregateToDto(
	aggregate: LearningPathProgress,
): LearningPathProgressDto {
	return {
		learningPathId: aggregate.learningPathId.toString(),
		userId: aggregate.userId.toString(),
		completedAt: aggregate.completedAt,
		completedSectionCount: aggregate.completedSectionCount,
		totalSectionCount: aggregate.totalSectionCount,
	};
}
