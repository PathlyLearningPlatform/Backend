import type { LearningPathProgress as ClientLearningPathProgress } from '@pathly-backend/contracts/learning_paths/v1/learning_paths.js';
import type { LearningPath } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import type {
	LearningPathDto,
	LearningPathProgressDto,
} from '@/app/learning-paths/dtos';

export function learningPathDtoToClient(dto: LearningPathDto): LearningPath {
	return {
		id: dto.id,
		createdAt: dto.createdAt.toISOString(),
		updatedAt: dto.updatedAt?.toISOString() ?? '',
		name: dto.name,
		description: dto.description ?? '',
		sectionCount: dto.sectionCount,
	};
}

export function learningPathProgressDtoToClient(
	dto: LearningPathProgressDto,
): ClientLearningPathProgress {
	return {
		learningPathId: dto.learningPathId,
		userId: dto.userId,
		completedAt: dto.completedAt?.toISOString() ?? '',
		totalSectionCount: dto.totalSectionCount,
		completedSectionCount: dto.completedSectionCount,
	};
}
