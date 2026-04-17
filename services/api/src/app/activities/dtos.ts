import type { ActivityType } from '@/domain/activities';

export interface ActivityDto {
	id: string;
	lessonId: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	type: ActivityType;
	order: number;
}

export interface ActivityProgressDto {
	activityId: string;
	lessonId: string;
	userId: string;
	completedAt: Date | null;
}
