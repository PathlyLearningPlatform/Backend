import { ILearningPathProgressRepository } from '@/domain/learning-path-progress/interfaces';
import { LearningPathProgressNotFoundException } from '@/domain/learning-path-progress/exceptions';

export class RemoveLearningPathProgressUseCase {
	constructor(
		private readonly learningPathProgressRepository: ILearningPathProgressRepository,
	) {}

	async execute(id: string): Promise<void> {
		const wasRemoved = await this.learningPathProgressRepository.remove(id);

		if (wasRemoved === false) {
			throw new LearningPathProgressNotFoundException(id);
		}
	}
}
