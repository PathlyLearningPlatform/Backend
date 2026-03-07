import { Activity } from '../activity.aggregate';
import { ActivityId } from '../value-objects';

export interface IActivityRepository {
	load(id: ActivityId): Promise<Activity | null>;
	save(aggregate: Activity): Promise<void>;
	remove(id: ActivityId): Promise<boolean>;
}
