import type { ICommandHandler } from '@/app/common';
import { UserId, UUID } from '@/domain/common';
import {
	type ILearningPathProgressRepository,
	LearningPathId,
	LearningPathProgressId,
} from '@/domain/learning-paths';
import { LearningPathProgressNotFoundException } from '../exceptions';

type RemoveLearningPathProgressCommand = {
	userId: string;
	learningPathId: string;
};

export class RemoveLearningPathProgressHandler
	implements ICommandHandler<RemoveLearningPathProgressCommand, void>
{
	constructor(
		private readonly learningPathProgressRepository: ILearningPathProgressRepository,
	) {}

	async execute(command: RemoveLearningPathProgressCommand): Promise<void> {
		const userId = UserId.create(UUID.create(command.userId));
		const learningPathId = LearningPathId.create(
			UUID.create(command.learningPathId),
		);
		const id = LearningPathProgressId.create(learningPathId, userId);

		const wasRemoved = await this.learningPathProgressRepository.remove(id);

		if (!wasRemoved) {
			throw new LearningPathProgressNotFoundException('');
		}
	}
}
