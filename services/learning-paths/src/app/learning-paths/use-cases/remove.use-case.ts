import { InvalidReferenceException } from '@pathly-backend/core/index.js';
import type { ILearningPathsRepository } from '@domain/learning-paths/interfaces';
import {
	LearningPathCannotBeRemovedException,
	LearningPathNotFoundException,
} from '@/domain/learning-paths/exceptions';

export class RemoveLearningPathUseCase {
	constructor(
		private readonly learningPathsRepository: ILearningPathsRepository,
	) {}

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
