import { ILearningPathProgressRepository } from '@/domain/learning-path-progress/interfaces';
import { UpdateLearningPathProgressCommand } from '../commands';
import { LearningPathProgress } from '@/domain/learning-path-progress/entities';
import { randomUUID } from 'crypto';
import { ILearningPathsService } from '@/app/interfaces';
import { LearningPathNotFoundException } from '@/app/exceptions';
import { LearningPathProgressNotFoundException } from '@/domain/learning-path-progress/exceptions';

export class UpdateLearningPathProgressUseCase {
	constructor(
		private readonly learningPathProgressRepository: ILearningPathProgressRepository,
	) {}

	async execute(
		command: UpdateLearningPathProgressCommand,
	): Promise<LearningPathProgress> {
		const progress = await this.learningPathProgressRepository.findOne(
			command.where.id,
		);

		if (!progress) {
			throw new LearningPathProgressNotFoundException(command.where.id);
		}

		progress.update(command.fields ?? {});

		await this.learningPathProgressRepository.save(progress);

		return progress;
	}
}
