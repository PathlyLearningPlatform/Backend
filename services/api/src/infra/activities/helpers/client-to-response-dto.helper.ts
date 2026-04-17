import type { ActivityDto, ActivityProgressDto } from '@/app/activities/dtos';
import type { ActivityResponseDto, ActivityProgressResponseDto } from '../dtos';
import type { ActivityType } from '../enums';

export function clientActivityToResponseDto(
	activity: ActivityDto,
): ActivityResponseDto {
	return {
		id: activity.id,
		lessonId: activity.lessonId,
		createdAt: activity.createdAt.toISOString(),
		name: activity.name,
		order: activity.order,
		type: activity.type as ActivityType,
		description: activity.description,
		updatedAt: activity.updatedAt ? activity.updatedAt.toISOString() : null,
	};
}

export function clientActivityProgressToResponseDto(
	progress: ActivityProgressDto,
): ActivityProgressResponseDto {
	return {
		activityId: progress.activityId,
		lessonId: progress.lessonId,
		userId: progress.userId,
		completedAt: progress.completedAt?.toISOString() ?? null,
	};
}
