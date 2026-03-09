import type { LearningPath as ClientLearningPath } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import type { LearningPath } from '@/domain/learning-paths/learning-path.aggregate';

export function learningPathAggregateToClient(
	aggregate: LearningPath,
): ClientLearningPath {
	return {
		id: aggregate.id.value,
		name: aggregate.name.value,
		description: aggregate.description?.value
			? aggregate.description.value
			: '',
		updatedAt:
			aggregate.updatedAt === null ? '' : aggregate.updatedAt.toISOString(),
		createdAt: aggregate.createdAt.toISOString(),
		sectionCount: aggregate.sectionCount,
	};
}
