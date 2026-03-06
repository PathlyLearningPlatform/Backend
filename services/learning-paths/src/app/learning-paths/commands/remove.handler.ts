import { ICommandHandler } from '@/app/common';
import { ILearningPathRepository } from '@/domain/learning-paths/interfaces';
import { LearningPathId } from '@/domain/learning-paths/value-objects';
import { LearningPathNotFoundException } from '@app/common';

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
		const id = LearningPathId.create(command.where.id);

		const learningPath = await this.learningPathRepository.load(id);

		if (!learningPath) {
			throw new LearningPathNotFoundException(id.value);
		}

		learningPath.ensureCanRemove();

		await this.learningPathRepository.remove(id);
	}
}
