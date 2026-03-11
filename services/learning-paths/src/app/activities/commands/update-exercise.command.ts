import { ICommandHandler, ActivityNotFoundException } from '@/app/common';
import { IActivityRepository } from '@/domain/activities/interfaces';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import {
	ActivityDescription,
	ActivityName,
	ActivityType,
} from '@/domain/activities/value-objects';
import { Exercise } from '@/domain/activities/exercises/exercise.aggregate';
import { ExerciseDifficulty } from '@/domain/activities/exercises/value-objects';
import { ExerciseDto } from '../dtos';

type UpdateExerciseCommand = {
	where: {
		id: string;
	};
	props?: {
		name?: string;
		description?: string | null;
		difficulty?: ExerciseDifficulty;
	};
};
type UpdateExerciseResult = ExerciseDto;

export class UpdateExerciseHandler
	implements ICommandHandler<UpdateExerciseCommand, UpdateExerciseResult>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(command: UpdateExerciseCommand): Promise<UpdateExerciseResult> {
		const id = ActivityId.create(command.where.id);
		const activity = await this.activityRepository.load(id);

		if (!activity || !(activity instanceof Exercise)) {
			throw new ActivityNotFoundException(id.value);
		}

		const name = command.props?.name
			? ActivityName.create(command.props.name)
			: undefined;

		const description = command.props?.description
			? ActivityDescription.create(command.props.description)
			: command.props?.description === null
				? null
				: undefined;

		activity.update(new Date(), {
			name,
			description,
			difficulty: command.props?.difficulty,
		});

		await this.activityRepository.save(activity);

		return {
			type: ActivityType.EXERCISE,
			id: activity.id.value,
			lessonId: activity.lessonId.value,
			name: activity.name.value,
			description: activity.description?.value ?? null,
			createdAt: activity.createdAt,
			updatedAt: activity.updatedAt ?? null,
			order: activity.order.value,
			difficulty: activity.difficulty,
		};
	}
}
