import { randomUUID } from 'crypto';
import { Quiz } from '@/domain/activities/entities';
import { ActivityType } from '@/domain/activities/enums';
import type { CreateQuizCommand } from '../commands/create-quiz.command';
import type { IActivitiesRepository } from '@domain/activities/interfaces';
import { ILessonsRepository } from '@/domain/lessons/interfaces';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';

export class CreateQuizUseCase {
	constructor(
		private readonly activitiesRepository: IActivitiesRepository,
		private readonly lessonsRepository: ILessonsRepository,
	) {}

	async execute(command: CreateQuizCommand): Promise<Quiz> {
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
		});

		await this.activitiesRepository.saveQuiz(quiz);

		return quiz;
	}
}
