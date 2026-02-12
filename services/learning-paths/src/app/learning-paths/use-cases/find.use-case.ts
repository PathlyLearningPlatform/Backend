import type { FindLearningPathsCommand } from '@/app/learning-paths/commands';
import type { ILearningPathsRepository } from '@domain/learning-paths/interfaces';
import type { LearningPath } from '@/domain/learning-paths/entities';

/**
 * @description This class responsibility is to find paths. It uses paths repository for retrieving paths from a data source. pathsRepository in injected to this class via dependency injection and dependency inversion techniques by using IPathsRepository interface.
 */
export class FindLearningPathsUseCase {
	constructor(
		private readonly learningPathsRepository: ILearningPathsRepository,
	) {}

	/**
	 * @param command object with data for finding paths
	 * @returns found paths
	 * @description this function retrievies paths from a data source using given command
	 */
	async execute(command: FindLearningPathsCommand): Promise<LearningPath[]> {
		return this.learningPathsRepository.find(command);
	}
}
