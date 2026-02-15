import { randomUUID } from 'crypto';
import { Quiz } from '@/domain/activities/entities';
import { ActivityType } from '@/domain/activities/enums';
import type { CreateQuizCommand } from '../commands/create-quiz.command';
import type { IActivitiesRepository } from '@domain/activities/interfaces';
import { ILessonsRepository } from '@/domain/lessons/interfaces';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';
import { UniqueConstraintException } from '@pathly-backend/core/index.js';
import { ActivityOrderException } from '@/domain/activities/exceptions';

export class CreateQuizUseCase {
	constructor(
		private readonly activitiesRepository: IActivitiesRepository,
		private readonly lessonsRepository: ILessonsRepository,
	) {}

	async execute(command: CreateQuizCommand): Promise<Quiz> {
		try {
			const lesson = await this.lessonsRepository.findOne(command.lessonId);

			if (!lesson) {
				throw new LessonNotFoundException(command.lessonId);
			}

			const quiz = new Quiz({
				id: randomUUID(),
				lessonId: command.lessonId,
				createdAt: new Date(),
				updatedAt: new Date(),
				name: command.name,
				order: command.order,
				type: ActivityType.QUIZ,
				description: command.description || null,
				questions: [],
				nextQuestionId: 0,
			});

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
