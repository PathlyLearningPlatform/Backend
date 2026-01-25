import { ActivityType } from '@/domain/activities/enums';
import { CreateExerciseCommand } from '../commands/create-exercise.command';
import { IActivitiesRepository } from '../interfaces';
import { Exercise } from '@/domain/activities/entities';
import { randomUUID } from 'crypto';

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
