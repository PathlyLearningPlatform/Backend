import { LearningPathId } from '../value-objects/id.vo';
import { LearningPath } from '../learning-path.aggregate';
import { DomainEvent } from '@/domain/common';

export interface ILearningPathRepository {
	load(id: LearningPathId): Promise<LearningPath | null>;

	save(aggregate: LearningPath): Promise<void>;

	remove(id: LearningPathId): Promise<boolean>;
}
