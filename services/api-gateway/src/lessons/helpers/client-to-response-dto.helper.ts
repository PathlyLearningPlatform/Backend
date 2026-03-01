import { emptyStringToNull } from '@pathly-backend/common/index.js'
import type { Lesson as ClientLesson } from '@pathly-backend/contracts/learning-paths/v1/lessons.js'
import type { LessonResponseDto } from '../dtos'

export function clientLessonToResponseDto(
	client: ClientLesson,
): LessonResponseDto {
	return {
		id: client.id,
		name: client.name,
		activityCount: client.activityCount,
		createdAt: client.createdAt,
		order: client.order,
		unitId: client.unitId,
		description: emptyStringToNull(client.description),
		updatedAt: emptyStringToNull(client.description),
	}
}
