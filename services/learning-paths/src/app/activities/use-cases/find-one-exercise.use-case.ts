import type { Exercise } from '@/domain/activities/entities';
import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import type { IActivitiesRepository } from '@domain/activities/interfaces';

export class FindOneExerciseUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(activityId: string): Promise<Exercise> {
		const exercise =
			await this.activitiesRepository.findOneExercise(activityId);

		if (!exercise) {
			throw new ActivityNotFoundException(activityId);
		}

		return exercise;
	}
}
