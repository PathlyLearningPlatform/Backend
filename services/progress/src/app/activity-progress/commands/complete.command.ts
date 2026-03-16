import {
	ActivityNotFoundException,
	ICommandHandler,
	IEventBus,
	ILearningPathsService,
} from '@/app/common';
import { UserId, UUID } from '@/domain/common';
import { LessonId } from '@/domain/lesson-progress';
import {
	ActivityId,
	ActivityProgress,
	ActivityProgressId,
	IActivityProgressRepository,
} from '@/domain/activity-progress';
import { ILessonProgressReadRepository } from '@/app/lesson-progress';
import { ActivityProgressDto } from '../dtos';
import { LessonNotStartedException } from '../exceptions';
import { randomUUID } from 'crypto';

export type CompleteActivityCommand = {
	activityId: string;
	userId: string;
};
export type CompleteActivityResult = ActivityProgressDto;

export class CompleteActivityHandler
	implements ICommandHandler<CompleteActivityCommand, CompleteActivityResult>
{
	constructor(
		private readonly activityProgressRepository: IActivityProgressRepository,
		private readonly lessonProgressReadRepository: ILessonProgressReadRepository,
		private readonly learningPathsService: ILearningPathsService,
		private readonly eventBus: IEventBus,
	) {}

	async execute(
		command: CompleteActivityCommand,
	): Promise<CompleteActivityResult> {
		// TODO: check if user exists

		const activity = await this.learningPathsService.findActivityById(
			command.activityId,
		);

		if (!activity) {
			throw new ActivityNotFoundException(command.activityId);
		}

		const lessonProgressDto =
			await this.lessonProgressReadRepository.findForUser(
				activity.lessonId,
				command.userId,
			);

		if (!lessonProgressDto) {
			throw new LessonNotStartedException(activity.lessonId, command.userId);
		}

		const id = ActivityProgressId.create(UUID.create(randomUUID()));
		const activityProgress = ActivityProgress.create(id, {
			activityId: ActivityId.create(UUID.create(command.activityId)),
			userId: UserId.create(UUID.create(command.userId)),
			lessonId: LessonId.create(UUID.create(activity.lessonId)),
		});

		activityProgress.complete(new Date());

		await this.activityProgressRepository.save(activityProgress);

		const events = activityProgress.pullEvents();
		await this.eventBus.publish(events);

		return {
			id: activityProgress.id.toString(),
			activityId: activityProgress.activityId.toString(),
			userId: activityProgress.userId.toString(),
			lessonId: activityProgress.lessonId.toString(),
			completedAt: activityProgress.completedAt,
		};
	}
}
