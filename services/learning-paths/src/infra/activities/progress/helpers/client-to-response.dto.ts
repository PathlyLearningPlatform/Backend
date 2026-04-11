import type { ActivityProgressResponseDto } from '../dtos';

type ActivityProgressLike = {
	id: string;
	activityId: string;
	lessonId: string;
	userId: string;
	completedAt: Date | string | null;
};

export function clientActivityProgressToResponseDto(
	client: ActivityProgressLike,
): ActivityProgressResponseDto {
	return {
		activityId: client.activityId,
		completedAt:
			client.completedAt instanceof Date
				? client.completedAt.toISOString()
				: client.completedAt,
		userId: client.userId,
		id: client.id,
		lessonId: client.lessonId,
	};
}
