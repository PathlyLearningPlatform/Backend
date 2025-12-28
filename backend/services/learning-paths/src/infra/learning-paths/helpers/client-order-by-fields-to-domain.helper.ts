import { LearningPathsOrderByFields as ClientLearningPathsOrderByFields } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js';

import { LearningPathsOrderByFields } from '@/domain/learning-paths/enums';

export function clientLearningPathsOrderByFieldsToDomain(
	client: ClientLearningPathsOrderByFields,
): LearningPathsOrderByFields {
	switch (client) {
		case ClientLearningPathsOrderByFields.NAME:
			return LearningPathsOrderByFields.NAME;
		case ClientLearningPathsOrderByFields.CREATED_AT:
			return LearningPathsOrderByFields.CREATED_AT;
		case ClientLearningPathsOrderByFields.UPDATED_AT:
			return LearningPathsOrderByFields.UPDATED_AT;
	}
}
