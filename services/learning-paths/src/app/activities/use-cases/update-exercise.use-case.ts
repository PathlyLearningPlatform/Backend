import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import { UpdateExerciseCommand } from '../commands/update-exercise.command';
import { IActivitiesRepository } from '../interfaces';

export class UpdateExerciseUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: UpdateExerciseCommand) {
		try {
			const activity = await this.activitiesRepository.findOne(
				command.where.activityId,
			);

			if (!activity) {
				throw new ActivityNotFoundException(command.where.activityId);
			}

			const exercise = await this.activitiesRepository.findOneExercise(
				activity.id,
			);

			if (!exercise) {
				throw new ActivityNotFoundException(command.where.activityId);
			}

			activity.update({
				description: command.fields?.description,
				lessonId: command.fields?.lessonId,
				name: command.fields?.name,
				order: command.fields?.order,
			});
			exercise.update({
				difficulty: command.fields?.difficulty,
			});

			await Promise.all([
				this.activitiesRepository.save(activity),
				this.activitiesRepository.saveExercise(exercise),
			]);
		} catch (err) {
			throw err;
		}
	}
}
