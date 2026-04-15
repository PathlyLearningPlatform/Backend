import {
	type ICommandHandler,
	type IEventBus,
	LearningPathNotFoundException,
} from '@/app/common';
import { UserId, UUID } from '@/domain/common';
import {
	type ILearningPathProgressRepository,
	LearningPathId,
	LearningPathProgress,
	LearningPathProgressId,
} from '@/domain/learning-paths';
import type { LearningPathProgressDto } from '../dtos';
import type { ILearningPathReadRepository } from '../interfaces';

export type StartLearningPathCommand = {
	learningPathId: string;
	userId: string;
};
export type StartLearningPathResult = LearningPathProgressDto;

export class StartLearningPathHandler
	implements ICommandHandler<StartLearningPathCommand, StartLearningPathResult>
{
	constructor(
		private readonly learningPathProgressRepository: ILearningPathProgressRepository,
		private readonly learningPathReadRepository: ILearningPathReadRepository,
		private readonly eventBus: IEventBus,
	) {}

	async execute(
		command: StartLearningPathCommand,
	): Promise<LearningPathProgressDto> {
		// TODO: check if user exists

		const learningPath = await this.learningPathReadRepository.findById(
			command.learningPathId,
		);

		if (!learningPath) {
			throw new LearningPathNotFoundException(command.learningPathId);
		}

		const learningPathId = LearningPathId.create(
			UUID.create(command.learningPathId),
		);
		const userId = UserId.create(UUID.create(command.userId));
		const id = LearningPathProgressId.create(learningPathId, userId);
		const learningPathProgress = LearningPathProgress.create(id, {
			totalSectionCount: learningPath.sectionCount,
		});

		await this.learningPathProgressRepository.save(learningPathProgress);

		const events = learningPathProgress.pullEvents();
		await this.eventBus.publish(events);

		return {
			completedAt: learningPathProgress.completedAt,
			learningPathId: learningPathProgress.learningPathId.toString(),
			userId: learningPathProgress.userId.toString(),
			totalSectionCount: learningPathProgress.totalSectionCount,
			completedSectionCount: learningPathProgress.completedSectionCount,
		};
	}
}
