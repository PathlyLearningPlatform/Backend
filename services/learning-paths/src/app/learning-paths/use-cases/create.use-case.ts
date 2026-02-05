import { randomUUID } from 'node:crypto';
import type { CreateLearningPathCommand } from '@/app/learning-paths/commands';
import type { ILearningPathsRepository } from '@/app/learning-paths/interfaces';
import { LearningPath } from '@/domain/learning-paths/entities';

export class CreateLearningPathUseCase {
	constructor(
		private readonly learningPathsRepository: ILearningPathsRepository,
	) {}

	async execute(command: CreateLearningPathCommand): Promise<LearningPath> {
		const learningPath = new LearningPath({
			id: randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date(),
			name: command.name,
			description: command.description ?? null,
		});

		await this.learningPathsRepository.save(learningPath);

		return learningPath;
	}
}
