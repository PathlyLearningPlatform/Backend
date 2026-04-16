import { LearningPathNotFoundException } from '@app/common';
import type { ICommandHandler } from '@/app/common';
import { UUID } from '@/domain/common';
import {
	type ILearningPathRepository,
	LearningPathDescription,
	LearningPathId,
	LearningPathName,
} from '@/domain/learning-paths';
import type { LearningPathDto } from '../dtos';

type UpdateLearningPathCommand = {
	where: {
		id: string;
	};
	props?: {
		name?: string;
		description?: string | null;
	};
};
type UpdateLearningPathResult = LearningPathDto;

export class UpdateLearningPathHandler
	implements
		ICommandHandler<UpdateLearningPathCommand, UpdateLearningPathResult>
{
	constructor(
		private readonly learningPathRepository: ILearningPathRepository,
	) {}

	async execute(
		command: UpdateLearningPathCommand,
	): Promise<UpdateLearningPathResult> {
		const id = LearningPathId.create(UUID.create(command.where.id));
		const learningPath = await this.learningPathRepository.findById(id);

		if (!learningPath) {
			throw new LearningPathNotFoundException(id.toString());
		}

		const name = command.props?.name
			? LearningPathName.create(command.props.name)
			: undefined;

		const description = command.props?.description
			? LearningPathDescription.create(command.props.description)
			: command.props?.description === null
				? null
				: undefined;

		learningPath.update(new Date(), {
			name,
			description,
		});

		await this.learningPathRepository.save(learningPath);

		return {
			id: learningPath.id.toString(),
			name: learningPath.name.value,
			description: learningPath.description?.value ?? null,
			createdAt: learningPath.createdAt,
			updatedAt: learningPath.updatedAt ?? null,
			sectionCount: learningPath.sectionCount,
		};
	}
}
