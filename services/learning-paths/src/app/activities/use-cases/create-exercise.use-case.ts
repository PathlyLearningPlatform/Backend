import { randomUUID } from 'crypto';
import { Exercise } from '@/domain/activities/entities';
import { ActivityType } from '@/domain/activities/enums';
import type { CreateExerciseCommand } from '../commands/create-exercise.command';
import type { IActivitiesRepository } from '@domain/activities/interfaces';
import { ILessonsRepository } from '@/domain/lessons/interfaces';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';
import { UniqueConstraintException } from '@pathly-backend/core/index.js';
import { ActivityOrderException } from '@/domain/activities/exceptions';

export class CreateExerciseUseCase {
	constructor(
		private readonly activitiesRepository: IActivitiesRepository,
		private readonly lessonsRepository: ILessonsRepository,
	) {}

	async execute(command: CreateExerciseCommand): Promise<Exercise> {
		try {
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
		} catch (err) {
			if (err instanceof UniqueConstraintException) {
				const uniqueOrderViolation =
					err.fields.includes('order') && err.fields.includes('lessonId');

				if (uniqueOrderViolation) {
					throw new ActivityOrderException();
				}
			}

			throw err;
		}
	}
}
