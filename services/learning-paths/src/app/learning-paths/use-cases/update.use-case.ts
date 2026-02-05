import type { UpdateLearningPathCommand } from '@/app/learning-paths/commands';
import type { ILearningPathsRepository } from '@/app/learning-paths/interfaces';
import type { LearningPath } from '@/domain/learning-paths/entities';
import { LearningPathNotFoundException } from '@/domain/learning-paths/exceptions';

/**
 * @description This class responsibility is to update a path. It uses paths repository for updating paths in a data source. pathsRepository in injected to this class via dependency injection and dependency inversion techniques by using IPathsRepository interface.
 */
export class UpdateLearningPathUseCase {
	constructor(
		private readonly learningPathsRepository: ILearningPathsRepository,
	) {}

	/**
	 *
	 * @param command object with data for updating path
	 * @returns updated path
	 * @throws PathNotFoundException if path was not found
	 */
	async execute(command: UpdateLearningPathCommand): Promise<LearningPath> {
		const learningPath = await this.learningPathsRepository.findOne(
			command.where.id,
		);

		if (!learningPath) {
			throw new LearningPathNotFoundException(command.where.id);
		}

		learningPath.update({
			description: command.fields?.description,
			name: command.fields?.name,
		});

		return learningPath;
	}
}
