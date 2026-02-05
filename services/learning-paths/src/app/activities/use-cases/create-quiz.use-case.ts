import { randomUUID } from 'crypto';
import { Quiz } from '@/domain/activities/entities';
import { ActivityType } from '@/domain/activities/enums';
import type { CreateQuizCommand } from '../commands/create-quiz.command';
import type { IActivitiesRepository } from '../interfaces';

export class CreateQuizUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: CreateQuizCommand): Promise<Quiz> {
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
