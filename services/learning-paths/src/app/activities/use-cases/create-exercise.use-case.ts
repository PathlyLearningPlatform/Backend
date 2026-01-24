import { ActivityType } from '@/domain/activities/enums';
import { CreateExerciseCommand } from '../commands/create-exercise.command';
import { IActivitiesRepository } from '../interfaces';
import { Activity, Exercise } from '@/domain/activities/entities';
import { randomUUID } from 'crypto';

export class CreateExerciseUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: CreateExerciseCommand) {
		try {
			const activity = new Activity({
				id: randomUUID(),
				lessonId: command.lessonId,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				name: command.name,
				order: command.order,
				type: ActivityType.EXERCISE,
				description: command.description || null,
			});
			const exercise = new Exercise({
				activityId: activity.id,
				difficulty: command.difficulty,
			});

			await this.activitiesRepository.save(activity);
			await this.activitiesRepository.saveExercise(exercise);
		} catch (err) {
			throw err;
		}
	}
}
