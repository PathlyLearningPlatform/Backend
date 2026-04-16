import { LearningPathNotFoundException } from '@app/common';
import type { ICommandHandler } from '@/app/common';
import { UUID } from '@/domain/common';
import {
	type ILearningPathRepository,
	LearningPathId,
} from '@/domain/learning-paths';

type RemoveLearningPathCommand = {
	where: {
		id: string;
	};
};

export class RemoveLearningPathHandler
	implements ICommandHandler<RemoveLearningPathCommand, void>
{
	constructor(
		private readonly learningPathRepository: ILearningPathRepository,
	) {}

	async execute(command: RemoveLearningPathCommand): Promise<void> {
		const id = LearningPathId.create(UUID.create(command.where.id));

		const learningPath = await this.learningPathRepository.findById(id);

		if (!learningPath) {
			throw new LearningPathNotFoundException(id.toString());
		}

		learningPath.ensureCanRemove();

		await this.learningPathRepository.remove(id);
	}
}
