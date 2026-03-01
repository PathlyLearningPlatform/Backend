import type { UpdateLearningPathCommand } from '@/app/learning-paths/commands';
import type { ILearningPathsRepository } from '@domain/learning-paths/interfaces';
import type { LearningPath } from '@/domain/learning-paths/entities';
import { LearningPathNotFoundException } from '@/domain/learning-paths/exceptions';

export class UpdateLearningPathUseCase {
	constructor(
		private readonly learningPathsRepository: ILearningPathsRepository,
	) {}

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

		await this.learningPathsRepository.save(learningPath);

		return learningPath;
	}
}
