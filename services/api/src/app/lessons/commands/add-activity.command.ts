import { ICommandHandler, LessonNotFoundException } from '@/app/common';
import {
	Activity,
	ActivityDescription,
	ActivityId,
	ActivityName,
	ActivityType,
	IActivityRepository,
} from '@/domain/activities';
import { ActivityDto } from '../../activities/dtos';
import { ILessonRepository, LessonId } from '@/domain/lessons';
import { randomUUID } from 'crypto';
import { aggregateToDto as activityAggregateToDto } from '@app/activities/helpers';

export type AddActivityCommand = {
	name: string;
	description?: string;
	lessonId: string;
	type: ActivityType;
};

export class AddActivityHandler
	implements ICommandHandler<AddActivityCommand, ActivityDto>
{
	constructor(
		private readonly activityRepository: IActivityRepository,
		private readonly lessonRepository: ILessonRepository,
	) {}

	async execute(command: AddActivityCommand): Promise<ActivityDto> {
		const lessonId = LessonId.create(command.lessonId);
		const lesson = await this.lessonRepository.findById(lessonId);

		if (!lesson) {
			throw new LessonNotFoundException(command.lessonId);
		}

		const activityId = ActivityId.create(randomUUID());
		const activityRef = lesson.addActivity(activityId);
		const activityName = ActivityName.create(command.name);
		const activityDescription =
			command.description != null
				? ActivityDescription.create(command.description)
				: null;

		const activity = Activity.create(activityRef.activityId, {
			createdAt: new Date(),
			lessonId: lessonId,
			name: activityName,
			description: activityDescription,
			order: activityRef.order,
			type: command.type,
		});

		lesson.update(new Date());

		await this.activityRepository.save(activity);
		await this.lessonRepository.save(lesson);

		return activityAggregateToDto(activity);
	}
}
