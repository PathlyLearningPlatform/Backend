import type { Quiz } from '@/domain/activities/entities';
import {
	ActivityNotFoundException,
	ActivityOrderException,
} from '@/domain/activities/exceptions';
import type { UpdateQuizCommand } from '../commands/update-quiz.command';
import type { IActivitiesRepository } from '@domain/activities/interfaces';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';
import { ILessonsRepository } from '@/domain/lessons/interfaces';
import { UniqueConstraintException } from '@pathly-backend/core/index.js';

export class UpdateQuizUseCase {
	constructor(
		private readonly activitiesRepository: IActivitiesRepository,
		private readonly lessonsRepository: ILessonsRepository,
	) {}

	async execute(command: UpdateQuizCommand): Promise<Quiz> {
		try {
			const quiz = await this.activitiesRepository.findOneQuiz(
				command.where.activityId,
			);

			if (!quiz) {
				throw new ActivityNotFoundException(command.where.activityId);
			}

			quiz.update({
				description: command.fields?.description,
				lessonId: command.fields?.lessonId,
				name: command.fields?.name,
				order: command.fields?.order,
			});

			const lesson = await this.lessonsRepository.findOne(quiz.lessonId);

			if (!lesson) {
				throw new LessonNotFoundException(quiz.lessonId);
			}

			await this.activitiesRepository.saveQuiz(quiz);

			return quiz;
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
