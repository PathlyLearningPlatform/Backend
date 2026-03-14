import type { LessonProgress as ClientLessonProgress } from '@pathly-backend/contracts/progress/v1/lessons.js'
import type { LessonProgressResponseDto } from '../dtos'

export function clientLessonProgressToResponseDto(
	client: ClientLessonProgress,
): LessonProgressResponseDto {
	return {
		lessonId: client.lessonId,
		userId: client.userId,
		completedAt: client.completedAt,
		totalActivityCount: client.totalActivityCount,
		completedActivityCount: client.completedActivityCount,
	}
}
