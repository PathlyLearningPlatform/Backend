import { LearningPathDto } from '@/app/learning-paths/dtos';
import { LearningPath } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';

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
