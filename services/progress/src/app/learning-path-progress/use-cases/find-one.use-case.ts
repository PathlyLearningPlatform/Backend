import { ILearningPathProgressRepository } from '@/domain/learning-path-progress/interfaces';
import { LearningPathProgress } from '@/domain/learning-path-progress/entities';
import { LearningPathProgressNotFoundException } from '@/domain/learning-path-progress/exceptions';

export class FindOneLearningPathProgressUseCase {
	constructor(
		private readonly learningPathProgressRepository: ILearningPathProgressRepository,
	) {}

	async execute(id: string): Promise<LearningPathProgress> {
		const progress = await this.learningPathProgressRepository.findOne(id);

		if (!progress) {
			throw new LearningPathProgressNotFoundException(id);
		}

		return progress;
	}
}
