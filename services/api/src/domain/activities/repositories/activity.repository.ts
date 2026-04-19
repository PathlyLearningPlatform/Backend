import type { Activity } from '../activity.aggregate';
import type { ActivityId } from '../value-objects';
import { LessonId } from '@/domain/lessons';
import { Order } from '@/domain/common';

export type ListActivitiesOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
	where?: Partial<{
		lessonId: string;
	}>;
};

export interface IActivityRepository {
	findById(id: ActivityId): Promise<Activity | null>;

	findByLessonIdAndOrder(
		lessonId: LessonId,
		order: Order,
	): Promise<Activity | null>;

	list(options?: ListActivitiesOptions): Promise<Activity[]>;

	save(aggregate: Activity): Promise<void>;

	remove(id: ActivityId): Promise<boolean>;
}
