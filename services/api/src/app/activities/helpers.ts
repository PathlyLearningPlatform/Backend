import type { Activity, ActivityProgress } from '@/domain/activities';
import type { ActivityDto, ActivityProgressDto } from './dtos';

export function aggregateToDto(aggregate: Activity): ActivityDto {
	return {
		id: aggregate.id.value,
		lessonId: aggregate.lessonId.value,
		name: aggregate.name.value,
		description: aggregate.description?.value ?? null,
		createdAt: aggregate.createdAt,
		updatedAt: aggregate.updatedAt,
		order: aggregate.order.value,
		type: aggregate.type,
	};
}

export function progressAggregateToDto(
	aggregate: ActivityProgress,
): ActivityProgressDto {
	return {
		activityId: aggregate.activityId.value,
		lessonId: aggregate.lessonId.value,
		userId: aggregate.userId.toString(),
		completedAt: aggregate.completedAt,
	};
}
