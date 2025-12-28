import type { RemoveLearningPathCommand } from '@/app/learning-paths/commands';
import type { LearningPath } from '@/domain/learning-paths/entities';
import {
	LearningPathCannotBeRemovedException,
	LearningPathNotFoundException,
} from '@/domain/learning-paths/exceptions';
import type { ILearningPathsRepository } from '@/app/learning-paths/interfaces';
import { InvalidReferenceException } from '@pathly-backend/common/index.js';

/**
 * @description This class responsibility is to remove a path. It uses paths repository for removing path from a data source. pathsRepository in injected to this class via dependency injection and dependency inversion techniques by using IPathsRepository interface.
 */
export class RemoveLearningPathUseCase {
	constructor(private readonly learningPathsRepository: ILearningPathsRepository) {}

	/**
	 *
	 * @param command object with data for removing path
	 * @returns removed path
	 * @throws
	 * {PathNotFoundException} if path was not found
	 * {PathCannotBeRemovedException} if path has sections
	 */
	async execute(command: RemoveLearningPathCommand): Promise<LearningPath> {
		try {
			const learningPath = await this.learningPathsRepository.remove(command);

			if (!learningPath) {
				throw new LearningPathNotFoundException(command.where.id);
			}

			return learningPath;
		} catch (err) {
			if (err instanceof InvalidReferenceException) {
				throw new LearningPathCannotBeRemovedException(command.where.id);
			}

			throw err;
		}
	}
}
