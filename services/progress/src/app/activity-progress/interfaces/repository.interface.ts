import { ActivityProgress } from '@/domain/activity-progress/entities';
import { ActivityProgressFilter } from '../types';
import { DomainEvent } from '@/domain/common';

export interface IActivityProgressRepository {
	list(filter?: ActivityProgressFilter): Promise<ActivityProgress[]>;

	findOne(activityId: string, userId: string): Promise<ActivityProgress | null>;
	findById(id: string): Promise<ActivityProgress | null>;

	save(entity: ActivityProgress): Promise<DomainEvent[]>;

	removeById(id: string): Promise<boolean>;
}
