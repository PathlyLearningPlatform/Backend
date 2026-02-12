import type {
	LearningPath,
	LearningPathQuery,
} from '@/domain/learning-paths/entities';

export interface ILearningPathsRepository {
	find(query?: LearningPathQuery): Promise<LearningPath[]>;

	findOne(id: string): Promise<LearningPath | null>;

	save(entity: LearningPath): Promise<void>;

	remove(id: string): Promise<boolean>;
}
