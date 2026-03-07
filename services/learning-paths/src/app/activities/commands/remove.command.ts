import {
	ActivityNotFoundException,
	ICommandHandler,
	LessonNotFoundException,
} from '@/app/common';
import { IActivityRepository } from '@/domain/activities/interfaces';
import { ActivityId } from '@/domain/activities/value-objects';
import { ILessonRepository } from '@/domain/lessons/interfaces';

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
		const activity = await this.activityRepository.load(activityId);

		if (!activity) {
			throw new ActivityNotFoundException(command.activityId);
		}

		const lesson = await this.lessonRepository.load(activity.lessonId);

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
