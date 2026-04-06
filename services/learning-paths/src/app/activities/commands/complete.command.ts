import {
	ActivityNotFoundException,
	type ICommandHandler,
	type IEventBus,
} from "@/app/common";
import {
	ActivityId,
	ActivityProgress,
	ActivityProgressId,
	type IActivityProgressRepository,
} from "@/domain/activities";
import { UserId, UUID } from "@/domain/common";
import { LessonId } from "@/domain/lessons";
import type { ActivityProgressDto } from "../dtos";
import type { IActivityReadRepository } from "../interfaces";

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
		private readonly activityReadRepository: IActivityReadRepository,
		private readonly eventBus: IEventBus,
	) {}

	async execute(
		command: CompleteActivityCommand,
	): Promise<CompleteActivityResult> {
		const activity = await this.activityReadRepository.findById(
			command.activityId,
		);

		if (!activity) {
			throw new ActivityNotFoundException(command.activityId);
		}

		const activityId = ActivityId.create(command.activityId);
		const userId = UserId.create(UUID.create(command.userId));
		const id = ActivityProgressId.create(activityId, userId);
		const activityProgress = ActivityProgress.create(id, {
			lessonId: LessonId.create(activity.lessonId),
		});

		activityProgress.complete(new Date());

		await this.activityProgressRepository.save(activityProgress);

		const events = activityProgress.pullEvents();
		await this.eventBus.publish(events);

		return {
			id: activityProgress.id.toString(),
			activityId: activityProgress.activityId.value,
			userId: activityProgress.userId.toString(),
			lessonId: activityProgress.lessonId.value,
			completedAt: activityProgress.completedAt,
		};
	}
}
