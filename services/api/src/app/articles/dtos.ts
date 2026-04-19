import { ActivityType } from '@/domain/activities';

export interface ArticleDto {
	id: string;
	lessonId: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	type: ActivityType;
	order: number;
	ref: string;
}
