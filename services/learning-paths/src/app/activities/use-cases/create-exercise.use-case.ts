import { randomUUID } from 'crypto';
import { Exercise } from '@/domain/activities/entities';
import { ActivityType } from '@/domain/activities/enums';
import type { CreateExerciseCommand } from '../commands/create-exercise.command';
import type { IActivitiesRepository } from '@domain/activities/interfaces';
import { ILessonsRepository } from '@/domain/lessons/interfaces';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';

export class CreateExerciseUseCase {
	constructor(
		private readonly activitiesRepository: IActivitiesRepository,
		private readonly lessonsRepository: ILessonsRepository,
	) {}

	async execute(command: CreateExerciseCommand): Promise<Exercise> {
		const lesson = await this.lessonsRepository.findOne(command.lessonId);

		if (!lesson) {
			throw new LessonNotFoundException(command.lessonId);
		}

		const exercise = new Exercise({
			id: randomUUID(),
			lessonId: command.lessonId,
			createdAt: new Date(),
			updatedAt: new Date(),
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
