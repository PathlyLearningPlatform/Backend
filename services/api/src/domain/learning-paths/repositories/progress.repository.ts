import type { LearningPathProgress } from '../progress.aggregate';
import type { LearningPathProgressId } from '../value-objects';

export type ListLearningPathProgressOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
	where?: Partial<{
		userId: string;
	}>;
};

export interface ILearningPathProgressRepository {
	findById(id: LearningPathProgressId): Promise<LearningPathProgress | null>;

	save(aggregate: LearningPathProgress): Promise<void>;

	remove(id: LearningPathProgressId): Promise<boolean>;

	list(
		options?: ListLearningPathProgressOptions,
	): Promise<LearningPathProgress[]>;
}
