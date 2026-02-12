import type { ILearningPathsRepository } from '@domain/learning-paths/interfaces';
import type { LearningPath } from '@/domain/learning-paths/entities';
import { LearningPathNotFoundException } from '@/domain/learning-paths/exceptions';

/**
 * @description This class responsibility is to find one path. It uses paths repository for retrieving path from a data source. pathsRepository in injected to this class via dependency injection and dependency inversion techniques by using IPathsRepository interface.
 */
export class FindOneLearningPathUseCase {
	constructor(
		private readonly learningPathsRepository: ILearningPathsRepository,
	) {}

	/**
	 *
	 * @param command object with data for finding one path
	 * @returns found path
	 * @throws PathNotFoundException if path was not found
	 */
	async execute(id: string): Promise<LearningPath> {
		const learningPath = await this.learningPathsRepository.findOne(id);

		if (!learningPath) {
			throw new LearningPathNotFoundException(id);
		}

		return learningPath;
	}
}
