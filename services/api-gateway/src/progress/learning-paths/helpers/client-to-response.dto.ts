import type { LearningPathProgress as ClientLearningPathProgress } from '@pathly-backend/contracts/progress/v1/learning-paths.js'
import type { LearningPathProgressResponseDto } from '../dtos'

export function clientLearningPathProgressToResponseDto(
	client: ClientLearningPathProgress,
): LearningPathProgressResponseDto {
	return {
		id: client.id,
		learningPathId: client.learningPathId,
		userId: client.userId,
		completedAt: client.completedAt,
		totalSectionCount: client.totalSectionCount,
		completedSectionCount: client.completedSectionCount,
	}
}
