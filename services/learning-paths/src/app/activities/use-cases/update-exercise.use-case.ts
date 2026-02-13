import type { Exercise } from '@/domain/activities/entities';
import {
	ActivityNotFoundException,
	ActivityOrderException,
} from '@/domain/activities/exceptions';
import type { UpdateExerciseCommand } from '../commands/update-exercise.command';
import type { IActivitiesRepository } from '@domain/activities/interfaces';
import { ILessonsRepository } from '@/domain/lessons/interfaces';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';
import { UniqueConstraintException } from '@pathly-backend/core/index.js';

export class UpdateExerciseUseCase {
	constructor(
		private readonly activitiesRepository: IActivitiesRepository,
		private readonly lessonsRepository: ILessonsRepository,
	) {}

	async execute(command: UpdateExerciseCommand): Promise<Exercise> {
		try {
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

			const lesson = await this.lessonsRepository.findOne(exercise.lessonId);

			if (!lesson) {
				throw new LessonNotFoundException(exercise.lessonId);
			}

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
