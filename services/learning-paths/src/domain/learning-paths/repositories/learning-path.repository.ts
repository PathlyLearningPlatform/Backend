import type { LearningPath } from "../learning-path.aggregate";
import type { LearningPathId } from "../value-objects/id.vo";

export interface ILearningPathRepository {
	load(id: LearningPathId): Promise<LearningPath | null>;

	save(aggregate: LearningPath): Promise<void>;

	remove(id: LearningPathId): Promise<boolean>;
}
