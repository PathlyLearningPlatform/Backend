import { LearningPathDto } from '../dtos';
import { LearningPathFilter } from './filter.interface';

export interface ILearningPathReadRepository {
	list(filter?: LearningPathFilter): Promise<LearningPathDto[]>;
	findById(id: string): Promise<LearningPathDto | null>;
}
