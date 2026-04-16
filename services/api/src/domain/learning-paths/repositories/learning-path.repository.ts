import type { LearningPath } from '../learning-path.aggregate';
import type { LearningPathId } from '../value-objects/id.vo';

export type ListLearningPathsOptions = {
	options?: {
		limit?: number;
		page?: number;
	};
	where?: {};
};

export interface ILearningPathRepository {
	findById(id: LearningPathId): Promise<LearningPath | null>;

	save(aggregate: LearningPath): Promise<void>;

	remove(id: LearningPathId): Promise<boolean>;

	list(options?: ListLearningPathsOptions): Promise<LearningPath[]>;
}
