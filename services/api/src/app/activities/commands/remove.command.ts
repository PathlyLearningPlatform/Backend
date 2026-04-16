import {
	ActivityNotFoundException,
	type ICommandHandler,
	LessonNotFoundException,
} from '@/app/common';
import type { IActivityRepository } from '@/domain/activities/repositories';
import { ActivityId } from '@/domain/activities/value-objects';
import type { ILessonRepository } from '@/domain/lessons/repositories';

type RemoveActivityCommand = {
	activityId: string;
};

export class RemoveActivityHandler
	implements ICommandHandler<RemoveActivityCommand, void>
{
	constructor(
		private readonly activityRepository: IActivityRepository,
		private readonly lessonRepository: ILessonRepository,
	) {}

	async execute(command: RemoveActivityCommand): Promise<void> {
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

		lesson.removeActivity(activityId);
		lesson.update(new Date());

		await this.activityRepository.remove(activityId);
		await this.lessonRepository.save(lesson);
	}
}
