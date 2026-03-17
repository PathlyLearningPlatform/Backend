import type { LearningPathProgressDto } from '@/app/learning-path-progress';
import type { LearningPathProgress as ClientLearningPathProgress } from '@pathly-backend/contracts/progress/v1/learning-paths.js';

export function learningPathProgressDtoToClient(
	dto: LearningPathProgressDto,
): ClientLearningPathProgress {
	return {
		id: dto.id,
		learningPathId: dto.learningPathId,
		userId: dto.userId,
		completedAt: dto.completedAt?.toISOString() ?? '',
		totalSectionCount: dto.totalSectionCount,
		completedSectionCount: dto.completedSectionCount,
	};
}
