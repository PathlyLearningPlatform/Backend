import type { Activity } from "../activity.aggregate";
import type { ActivityId } from "../value-objects";

export interface IActivityRepository {
	load(id: ActivityId): Promise<Activity | null>;
	save(aggregate: Activity): Promise<void>;
	remove(id: ActivityId): Promise<boolean>;
}
