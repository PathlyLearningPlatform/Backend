import { randomUUID } from 'crypto';
import { Exercise } from '@/domain/activities/entities';
import { ActivityType } from '@/domain/activities/enums';
import type { CreateExerciseCommand } from '../commands/create-exercise.command';
import type { IActivitiesRepository } from '../interfaces';

export class CreateExerciseUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: CreateExerciseCommand): Promise<Exercise> {
		const exercise = new Exercise({
			id: randomUUID(),
			lessonId: command.lessonId,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			name: command.name,
			order: command.order,
			type: ActivityType.EXERCISE,
			description: command.description || null,
			difficulty: command.difficulty,
		});

		await this.activitiesRepository.saveExercise(exercise);

		return exercise;
	}
}
