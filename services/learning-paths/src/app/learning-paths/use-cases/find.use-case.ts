import type { FindLearningPathsCommand } from '@/app/learning-paths/commands';
import type { ILearningPathsRepository } from '@domain/learning-paths/interfaces';
import type { LearningPath } from '@/domain/learning-paths/entities';

export class FindLearningPathsUseCase {
	constructor(
		private readonly learningPathsRepository: ILearningPathsRepository,
	) {}

	async execute(command: FindLearningPathsCommand): Promise<LearningPath[]> {
		return this.learningPathsRepository.find(command);
	}
}
