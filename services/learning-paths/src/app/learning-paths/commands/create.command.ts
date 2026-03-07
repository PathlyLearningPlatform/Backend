import { ICommandHandler } from '@/app/common';
import { ILearningPathRepository } from '@/domain/learning-paths/interfaces';
import { LearningPath } from '@/domain/learning-paths/learning-path.aggregate';
import { LearningPathId } from '@/domain/learning-paths/value-objects';
import { randomUUID } from 'crypto';
import { LearningPathDto } from '../dtos';

type CreateLearningPathCommand = {
	name: string;
	description?: string | null;
};
type CreateLearningPathResult = LearningPathDto;

export class CreateLearningPathHandler
	implements
		ICommandHandler<CreateLearningPathCommand, CreateLearningPathResult>
{
	constructor(
		private readonly learningPathRepository: ILearningPathRepository,
	) {}

	async execute(
		command: CreateLearningPathCommand,
	): Promise<CreateLearningPathResult> {
		const id = LearningPathId.create(randomUUID());

		const learningPath = LearningPath.create(id, {
			name: command.name,
			createdAt: new Date(),
			description: command.description,
		});

		await this.learningPathRepository.save(learningPath);

		return {
			id: learningPath.id.value,
			createdAt: learningPath.createdAt,
			updatedAt: learningPath.updatedAt ?? null,
			name: learningPath.name.value,
			description: learningPath.description
				? learningPath.description.value
				: null,
			sectionCount: learningPath.sectionCount,
		};
	}
}
