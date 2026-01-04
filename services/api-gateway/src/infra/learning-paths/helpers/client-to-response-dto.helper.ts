import { emptyStringToNull } from '@pathly-backend/common/index.js'
import type { LearningPath as ClientLearningPath } from '@pathly-backend/contracts/learning-paths/v1/learning-paths.js'
import type { LearningPathResponseDto } from '../dtos'

export function clientLearningPathToResponseDto(
	entity: ClientLearningPath,
): LearningPathResponseDto {
	return {
		...entity,
		description: emptyStringToNull(entity.description),
	}
}
