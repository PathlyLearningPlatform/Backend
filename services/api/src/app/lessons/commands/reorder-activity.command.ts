import {
	ActivityNotFoundException,
	type ICommandHandler,
	LessonNotFoundException,
} from '@/app/common';
import type { IActivityRepository } from '@/domain/activities/repositories';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import { Order } from '@/domain/common';
import type { ILessonRepository } from '@/domain/lessons/repositories';

type ReorderActivityCommand = {
	activityId: string;
	order: number;
};

export class ReorderActivityHandler
	implements ICommandHandler<ReorderActivityCommand, void>
{
	constructor(
		private readonly lessonRepository: ILessonRepository,
		private readonly activityRepository: IActivityRepository,
	) {}

	async execute(command: ReorderActivityCommand): Promise<void> {
		const activityId = ActivityId.create(command.activityId);
		const activity = await this.activityRepository.findById(activityId);

		if (!activity) {
			throw new ActivityNotFoundException(command.activityId);
		}

		const lesson = await this.lessonRepository.findById(activity.lessonId);

		// never going to happen
		// only for type safety
		if (!lesson) {
			throw new LessonNotFoundException(activity.lessonId.value);
		}

		const order = Order.create(command.order);
		const newOrder = lesson.reorderActivity(activityId, order);

		// never going to happen
		// only for type safety
		if (!newOrder) {
			throw new ActivityNotFoundException(activity.id.value);
		}

		activity.update(new Date(), { order: newOrder });
		lesson.update(new Date());

		await this.activityRepository.save(activity);
		await this.lessonRepository.save(lesson);
	}
}
