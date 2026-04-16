import type { ActivityProgress } from '../progress.aggregate';
import type { ActivityProgressId } from '../value-objects';

export type ListActivityProgressOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
	where?: Partial<{
		userId: string;
		lessonId: string;
	}>;
};

export interface IActivityProgressRepository {
	findById(id: ActivityProgressId): Promise<ActivityProgress | null>;

	save(aggregate: ActivityProgress): Promise<void>;

	remove(id: ActivityProgressId): Promise<boolean>;

	list(options?: ListActivityProgressOptions): Promise<ActivityProgress[]>;
}
