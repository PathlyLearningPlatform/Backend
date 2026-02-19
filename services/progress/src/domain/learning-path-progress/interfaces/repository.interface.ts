import { LearningPathProgress, LearningPathProgressQuery } from '../entities';

export interface ILearningPathProgressRepository {
	find(query?: LearningPathProgressQuery): Promise<LearningPathProgress[]>;
	findOne(id: string): Promise<LearningPathProgress | null>;
	save(entity: LearningPathProgress): Promise<void>;
	remove(id: string): Promise<boolean>;
}
