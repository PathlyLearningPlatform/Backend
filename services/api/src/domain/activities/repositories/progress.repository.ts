import type { ActivityProgress } from "../progress.aggregate";
import type { ActivityProgressId } from "../value-objects";

export interface IActivityProgressRepository {
	load(id: ActivityProgressId): Promise<ActivityProgress | null>;

	save(aggregate: ActivityProgress): Promise<void>;

	remove(id: ActivityProgressId): Promise<boolean>;
}
