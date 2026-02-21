import { ILearningPathProgressRepository } from '@/domain/learning-path-progress/interfaces';
import { CreateLearningPathProgressCommand } from '../commands';
import { LearningPathProgress } from '@/domain/learning-path-progress/entities';
import { randomUUID } from 'crypto';
import { ILearningPathsService } from '@/app/interfaces';
import { LearningPathNotFoundException } from '@/app/exceptions';

export class CreateLearningPathProgressUseCase {
	constructor(
		private readonly learningPathProgressRepository: ILearningPathProgressRepository,
		private readonly learningPathsService: ILearningPathsService,
	) {}

	async execute(
		command: CreateLearningPathProgressCommand,
	): Promise<LearningPathProgress> {
		const learningPath = await this.learningPathsService.findOneLearningPath(
			command.learningPathId,
		);

		if (!learningPath) {
			throw new LearningPathNotFoundException(command.learningPathId);
		}

		// TODO: handle situation where progress with provided learningPathId and userId already exists

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
