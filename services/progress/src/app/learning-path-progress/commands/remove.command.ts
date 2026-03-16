import { ICommandHandler } from '@/app/common';
import { UUID } from '@/domain/common';
import {
	ILearningPathProgressRepository,
	LearningPathProgressId,
} from '@/domain/learning-path-progress';
import { LearningPathProgressNotFoundException } from '../exceptions';

type RemoveLearningPathProgressCommand = {
	id: string;
};

export class RemoveLearningPathProgressHandler
	implements ICommandHandler<RemoveLearningPathProgressCommand, void>
{
	constructor(
		private readonly learningPathProgressRepository: ILearningPathProgressRepository,
	) {}

	async execute(command: RemoveLearningPathProgressCommand): Promise<void> {
		const wasRemoved = await this.learningPathProgressRepository.remove(
			LearningPathProgressId.create(UUID.create(command.id)),
		);

		if (!wasRemoved) {
			throw new LearningPathProgressNotFoundException('');
		}
	}
}
