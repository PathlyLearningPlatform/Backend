import { InvalidReferenceException } from '@pathly-backend/common/index.js';
import type { ILearningPathsRepository } from '@/app/learning-paths/interfaces';
import {
	LearningPathCannotBeRemovedException,
	LearningPathNotFoundException,
} from '@/domain/learning-paths/exceptions';

/**
 * @description This class responsibility is to remove a path. It uses paths repository for removing path from a data source. pathsRepository in injected to this class via dependency injection and dependency inversion techniques by using IPathsRepository interface.
 */
export class RemoveLearningPathUseCase {
	constructor(
		private readonly learningPathsRepository: ILearningPathsRepository,
	) {}

	/**
	 *
	 * @param command object with data for removing path
	 * @returns removed path
	 * @throws
	 * {PathNotFoundException} if path was not found
	 * {PathCannotBeRemovedException} if path has sections
	 */
	async execute(id: string): Promise<void> {
		try {
			const wasRemoved = await this.learningPathsRepository.remove(id);

			if (!wasRemoved) {
				throw new LearningPathNotFoundException(id);
			}
		} catch (err) {
			if (err instanceof InvalidReferenceException) {
				throw new LearningPathCannotBeRemovedException(id);
			}

			throw err;
		}
	}
}
