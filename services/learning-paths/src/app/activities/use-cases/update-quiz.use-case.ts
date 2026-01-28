import type { Quiz } from '@/domain/activities/entities';
import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import type { UpdateQuizCommand } from '../commands/update-quiz.command';
import type { IActivitiesRepository } from '../interfaces';

export class UpdateQuizUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: UpdateQuizCommand): Promise<Quiz> {
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

		await this.activitiesRepository.saveQuiz(quiz);

		return quiz;
	}
}
