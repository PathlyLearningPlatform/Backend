import { ICommandHandler, LearningPathNotFoundException } from '@/app/common';
import { LearningPathProgressDto } from '../dtos';
import {
	ILearningPathProgressRepository,
	LearningPathId,
	LearningPathProgress,
	LearningPathProgressId,
} from '@/domain/learning-path-progress';
import { IEventBus, ILearningPathsService } from '@/app/common/ports';
import { UserId, UUID } from '@/domain/common';
import { randomUUID } from 'node:crypto';

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
		private readonly learningPathsService: ILearningPathsService,
		private readonly eventBus: IEventBus,
	) {}

	async execute(
		command: StartLearningPathCommand,
	): Promise<LearningPathProgressDto> {
		// TODO: check if user exists

		const learningPath = await this.learningPathsService.findLearningPathById(
			command.learningPathId,
		);

		if (!learningPath) {
			throw new LearningPathNotFoundException(command.learningPathId);
		}

		const id = LearningPathProgressId.create(UUID.create(randomUUID()));
		const learningPathProgress = LearningPathProgress.create(id, {
			learningPathId: LearningPathId.create(
				UUID.create(command.learningPathId),
			),
			userId: UserId.create(UUID.create(command.userId)),
			totalSectionCount: learningPath.sectionCount,
		});

		await this.learningPathProgressRepository.save(learningPathProgress);

		const events = learningPathProgress.pullEvents();
		await this.eventBus.publish(events);

		return {
			id: learningPathProgress.id.toString(),
			completedAt: learningPathProgress.completedAt,
			learningPathId: learningPathProgress.learningPathId.toString(),
			userId: learningPathProgress.userId.toString(),
			totalSectionCount: learningPathProgress.totalSectionCount,
			completedSectionCount: learningPathProgress.completedSectionCount,
		};
	}
}
