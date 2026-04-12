import type {
	LearningPathDto,
	LearningPathProgressDto,
} from '@/app/learning-paths/dtos';
import type {
	LearningPathProgressResponseDto,
	LearningPathResponseDto,
} from '../dtos';

export function clientLearningPathToResponseDto(
	path: LearningPathDto,
): LearningPathResponseDto {
	return {
		id: path.id,
		createdAt: path.createdAt.toISOString(),
		name: path.name,
		sectionCount: path.sectionCount,
		description: path.description,
		updatedAt: path.updatedAt ? path.updatedAt.toISOString() : null,
	};
}

export function clientLearningPathProgressToResponseDto(
	progress: LearningPathProgressDto,
): LearningPathProgressResponseDto {
	return {
		completedAt: progress.completedAt?.toISOString() ?? null,
		completedSectionCount: progress.completedSectionCount,
		id: progress.id,
		learningPathId: progress.learningPathId,
		totalSectionCount: progress.totalSectionCount,
		userId: progress.userId,
	};
}
