import type {
	LearningPathDto,
	LearningPathProgressDto,
	ListLearningPathProgressDto,
} from '../dtos';
import type { LearningPathFilter } from './filter.interface';

export interface ILearningPathReadRepository {
	list(filter?: LearningPathFilter): Promise<LearningPathDto[]>;
	findById(id: string): Promise<LearningPathDto | null>;
}

export interface ILearningPathProgressReadRepository {
	list(dto?: ListLearningPathProgressDto): Promise<LearningPathProgressDto[]>;

	findOneForUser(
		learningPathId: string,
		userId: string,
	): Promise<LearningPathProgressDto | null>;
}
