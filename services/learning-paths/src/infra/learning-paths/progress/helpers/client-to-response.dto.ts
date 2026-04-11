import type { LearningPathProgressResponseDto } from '../dtos';

type LearningPathProgressLike = {
	id: string;
	learningPathId: string;
	userId: string;
	completedAt: Date | string | null;
	totalSectionCount: number;
	completedSectionCount: number;
};

export function clientLearningPathProgressToResponseDto(
	client: LearningPathProgressLike,
): LearningPathProgressResponseDto {
	return {
		id: client.id,
		learningPathId: client.learningPathId,
		userId: client.userId,
		completedAt:
			client.completedAt instanceof Date
				? client.completedAt.toISOString()
				: client.completedAt,
		totalSectionCount: client.totalSectionCount,
		completedSectionCount: client.completedSectionCount,
	};
}
