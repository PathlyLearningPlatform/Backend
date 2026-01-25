import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import { UpdateExerciseCommand } from '../commands/update-exercise.command';
import { IActivitiesRepository } from '../interfaces';
import { Exercise } from '@/domain/activities/entities';

export class UpdateExerciseUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: UpdateExerciseCommand): Promise<Exercise> {
		const exercise = await this.activitiesRepository.findOneExercise(
			command.where.activityId,
		);

		if (!exercise) {
			throw new ActivityNotFoundException(command.where.activityId);
		}

		exercise.update({
			description: command.fields?.description,
			lessonId: command.fields?.lessonId,
			name: command.fields?.name,
			order: command.fields?.order,
			difficulty: command.fields?.difficulty,
		});

		await this.activitiesRepository.saveExercise(exercise);

		return exercise;
	}
}
