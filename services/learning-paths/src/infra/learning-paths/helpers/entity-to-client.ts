import { nullToEmptyString } from '@pathly-backend/common';
import type { LearningPath as ClientLearningPath } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';
import type { LearningPath } from '@/domain/learning-paths/entities';

export function learningPathEntityToClient(
	entity: LearningPath,
): ClientLearningPath {
	return { ...entity, description: nullToEmptyString(entity.description) };
}
