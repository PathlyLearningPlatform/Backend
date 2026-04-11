import type { LearningPathDto } from '@/app/learning-paths/dtos';
import type { LearningPathResponseDto } from '../dtos';

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
