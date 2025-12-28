import type { CreateLearningPathCommand } from '@/app/learning-paths/commands';
import type { LearningPath } from '@/domain/learning-paths/entities';
import type { ILearningPathsRepository } from '@/app/learning-paths/interfaces';

/**
 * @description This class responsibility is to create a path. It uses paths repository for saving paths to a data source. pathsRepository in injected to this class via dependency injection and dependency inversion techniques by using IPathsRepository interface.
 */
export class CreateLearningPathUseCase {
	constructor(private readonly learningPathsRepository: ILearningPathsRepository) {}

	/**
	 * @param command object with data for path creation
	 * @returns created path
	 * @description this function saves path to a data source and returns it
	 */
	async execute(command: CreateLearningPathCommand): Promise<LearningPath> {
		return this.learningPathsRepository.create(command);
	}
}
