import { LearningPathsOrderByFields as ClientLearningPathsOrderByFields } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js'
import { LearningPathsOrderByFields } from '@/domain/learning-paths/enums'

export function domainPathsOrderByFieldsToClient(
	domain: LearningPathsOrderByFields,
): ClientLearningPathsOrderByFields {
	switch (domain) {
		case LearningPathsOrderByFields.NAME:
			return ClientLearningPathsOrderByFields.NAME
		case LearningPathsOrderByFields.CREATED_AT:
			return ClientLearningPathsOrderByFields.CREATED_AT
		case LearningPathsOrderByFields.UPDATED_AT:
			return ClientLearningPathsOrderByFields.UPDATED_AT
	}
}
