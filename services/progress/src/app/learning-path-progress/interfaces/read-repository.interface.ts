import { LearningPathProgressDto, ListLearningPathProgressDto } from '../dtos';

export interface ILearningPathProgressReadRepository {
	list(dto?: ListLearningPathProgressDto): Promise<LearningPathProgressDto[]>;

	findById(id: string): Promise<LearningPathProgressDto | null>;

	findForUser(
		learningPathId: string,
		userId: string,
	): Promise<LearningPathProgressDto | null>;
}
