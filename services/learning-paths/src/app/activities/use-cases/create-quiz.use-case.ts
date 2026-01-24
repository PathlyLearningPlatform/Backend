import { ActivityType } from '@/domain/activities/enums';
import { CreateQuizCommand } from '../commands/create-quiz.command';
import { IActivitiesRepository } from '../interfaces';
import { Activity, Quiz } from '@/domain/activities/entities';
import { randomUUID } from 'crypto';

export class CreateQuizUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: CreateQuizCommand) {
		try {
			const activity = new Activity({
				id: randomUUID(),
				lessonId: command.lessonId,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				name: command.name,
				order: command.order,
				type: ActivityType.QUIZ,
				description: command.description || null,
			});
			const quiz = new Quiz({
				activityId: activity.id,
			});

			await this.activitiesRepository.save(activity);
			await this.activitiesRepository.saveQuiz(quiz);
		} catch (err) {
			throw err;
		}
	}
}
