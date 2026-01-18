import { emptyStringToNull } from '@pathly-backend/common/index.js'
import type { Lesson as ClientLesson } from '@pathly-backend/contracts/learning-paths/v1/lessons.js'
import type { LessonResponseDto } from '../dtos'

export function clientLessonToResponseDto(
	client: ClientLesson,
): LessonResponseDto {
	return {
		...client,
		description: emptyStringToNull(client.description),
	}
}
