import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import { UpdateQuizCommand } from '../commands/update-quiz.command';
import { IActivitiesRepository } from '../interfaces';

export class UpdateQuizUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: UpdateQuizCommand) {
		try {
			const activity = await this.activitiesRepository.findOne(
				command.where.activityId,
			);

			if (!activity) {
				throw new ActivityNotFoundException(command.where.activityId);
			}

			const quiz = await this.activitiesRepository.findOneQuiz(activity.id);

			if (!quiz) {
				throw new ActivityNotFoundException(command.where.activityId);
			}

			activity.update({
				description: command.fields?.description,
				lessonId: command.fields?.lessonId,
				name: command.fields?.name,
				order: command.fields?.order,
			});
			quiz.update({});

			await Promise.all([
				this.activitiesRepository.save(activity),
				this.activitiesRepository.saveQuiz(quiz),
			]);
		} catch (err) {
			throw err;
		}
	}
}
