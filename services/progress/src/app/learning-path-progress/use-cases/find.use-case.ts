import { ILearningPathProgressRepository } from '@/domain/learning-path-progress/interfaces';
import { FindLearningPathProgressCommand } from '../commands';
import { LearningPathProgress } from '@/domain/learning-path-progress/entities';

export class FindLearningPathProgressUseCase {
	constructor(
		private readonly learningPathProgressRepository: ILearningPathProgressRepository,
	) {}

	async execute(
		command: FindLearningPathProgressCommand,
	): Promise<LearningPathProgress[]> {
		const progress = await this.learningPathProgressRepository.find(command);

		return progress;
	}
}
