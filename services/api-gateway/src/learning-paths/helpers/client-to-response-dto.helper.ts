import { emptyStringToNull } from '@pathly-backend/common/index.js'
import type { LearningPath as ClientLearningPath } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js'
import type { LearningPathResponseDto } from '../dtos'

export function clientLearningPathToResponseDto(
	client: ClientLearningPath,
): LearningPathResponseDto {
	return {
		id: client.id,
		createdAt: client.createdAt,
		name: client.name,
		sectionCount: client.sectionCount,
		description: emptyStringToNull(client.description),
		updatedAt: emptyStringToNull(client.updatedAt),
	}
}
