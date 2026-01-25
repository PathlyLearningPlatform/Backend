import { ActivityType } from '@/domain/activities/enums';
import { CreateQuizCommand } from '../commands/create-quiz.command';
import { IActivitiesRepository } from '../interfaces';
import { Quiz } from '@/domain/activities/entities';
import { randomUUID } from 'crypto';

export class CreateQuizUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: CreateQuizCommand): Promise<Quiz> {
		const quiz = new Quiz({
			id: randomUUID(),
			lessonId: command.lessonId,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			name: command.name,
			order: command.order,
			type: ActivityType.QUIZ,
			description: command.description || null,
		});

		await this.activitiesRepository.saveQuiz(quiz);

		return quiz;
	}
}
