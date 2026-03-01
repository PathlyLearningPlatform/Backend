import { nullToEmptyString } from '@pathly-backend/common';
import type { LearningPath as ClientLearningPath } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import type { LearningPath } from '@/domain/learning-paths/entities';

export function learningPathEntityToClient(
	entity: LearningPath,
): ClientLearningPath {
	return {
		id: entity.id,
		name: entity.name,
		description: nullToEmptyString(entity.description),
		updatedAt: entity.updatedAt === null ? '' : entity.updatedAt.toISOString(),
		createdAt: entity.createdAt.toISOString(),
		sectionCount: entity.sectionCount,
	};
}
