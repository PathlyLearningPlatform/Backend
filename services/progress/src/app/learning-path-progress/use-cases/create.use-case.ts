import { ILearningPathProgressRepository } from '@/domain/learning-path-progress/interfaces';
import { SaveLearningPathProgressCommand } from '../commands';
import { LearningPathProgress } from '@/domain/learning-path-progress/entities';
import { LearningPathProgressStatus } from '@/domain/learning-path-progress/enums';
import { randomUUID } from 'crypto';

export class CreateLearningPathProgressUseCase {
	constructor(
		private readonly learningPathProgressRepository: ILearningPathProgressRepository,
	) {}

	async execute(
		command: SaveLearningPathProgressCommand,
	): Promise<LearningPathProgress> {
		const progress = new LearningPathProgress({
			id: randomUUID(),
			learningPathId: command.learningPathId,
			userId: command.userId,
			completedAt: command.completedAt,
			completedSectionsCount: command.completedSectionsCount,
			status: command.status,
		});

		await this.learningPathProgressRepository.save(progress);

		return progress;
	}
}
