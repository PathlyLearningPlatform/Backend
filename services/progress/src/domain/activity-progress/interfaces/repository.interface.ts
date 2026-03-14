import { ActivityProgress } from '../activity-progress.aggregate';
import { ActivityProgressId } from '../value-objects';

export interface IActivityProgressRepository {
	load(id: ActivityProgressId): Promise<ActivityProgress>;

	save(aggregate: ActivityProgress): Promise<void>;

	remove(id: ActivityProgressId): Promise<boolean>;
}
