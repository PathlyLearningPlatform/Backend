import { ActivityProgress } from '@/domain/activity-progress/entities';
import { ActivityProgressFilter } from '../types';

export interface IActivityProgressRepository {
	list(filter?: ActivityProgressFilter): Promise<ActivityProgress[]>;
	listForUser(userId: string): Promise<ActivityProgress[]>;

	findOne(activityId: string, userId: string): Promise<ActivityProgress | null>;
	findById(id: string): Promise<ActivityProgress | null>;

	save(entity: ActivityProgress): Promise<void>;

	removeById(id: string): Promise<boolean>;
}
