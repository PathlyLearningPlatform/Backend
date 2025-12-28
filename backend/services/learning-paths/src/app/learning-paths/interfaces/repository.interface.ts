import type {
	CreateLearningPathCommand,
	FindOneLearningPathCommand,
	FindLearningPathsCommand,
	RemoveLearningPathCommand,
	UpdateLearningPathCommand,
} from '@/app/learning-paths/commands';
import type { LearningPath } from '@/domain/learning-paths/entities';

/**
 * This interface represents a class which task is to retrieve or add paths from / to a data source. It only tells what data is needed and what data is returned (it is datasource agnostic). Concrete path repositories should implement this interface.
 */
export interface ILearningPathsRepository {
	find(command: FindLearningPathsCommand): Promise<LearningPath[]>;
	findOne(command: FindOneLearningPathCommand): Promise<LearningPath | null>;
	create(command: CreateLearningPathCommand): Promise<LearningPath>;
	update(command: UpdateLearningPathCommand): Promise<LearningPath | null>;
	remove(command: RemoveLearningPathCommand): Promise<LearningPath | null>;
}
