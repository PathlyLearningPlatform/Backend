import { ActivityProgressResponseDto } from '../dtos'
import { ActivityProgress as ClientActivityProgress } from '@pathly-backend/contracts/progress/v1/activities.js'

export function clientActivityProgressToResponseDto(
	client: ClientActivityProgress,
): ActivityProgressResponseDto {
	return {
		activityId: client.activityId,
		completedAt: client.completedAt,
		userId: client.userId,
		id: client.id,
		lessonId: client.lessonId,
	}
}
