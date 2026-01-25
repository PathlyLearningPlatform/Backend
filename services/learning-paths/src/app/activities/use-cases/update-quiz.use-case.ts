import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import { UpdateQuizCommand } from '../commands/update-quiz.command';
import { IActivitiesRepository } from '../interfaces';
import { Quiz } from '@/domain/activities/entities';

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
