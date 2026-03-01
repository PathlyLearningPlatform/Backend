import type { ILearningPathsRepository } from '@domain/learning-paths/interfaces';
import type { LearningPath } from '@/domain/learning-paths/entities';
import { LearningPathNotFoundException } from '@/domain/learning-paths/exceptions';

export class FindOneLearningPathUseCase {
	constructor(
		private readonly learningPathsRepository: ILearningPathsRepository,
	) {}

	async execute(id: string): Promise<LearningPath> {
		const learningPath = await this.learningPathsRepository.findOne(id);

		if (!learningPath) {
			throw new LearningPathNotFoundException(id);
		}

		return learningPath;
	}
}
