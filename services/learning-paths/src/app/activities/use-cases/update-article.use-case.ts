import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import { UpdateArticleCommand } from '../commands/update-article.command';
import { IActivitiesRepository } from '../interfaces';

export class UpdateArticleUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: UpdateArticleCommand) {
		try {
			const activity = await this.activitiesRepository.findOne(
				command.where.activityId,
			);

			if (!activity) {
				throw new ActivityNotFoundException(command.where.activityId);
			}

			const article = await this.activitiesRepository.findOneArticle(
				activity.id,
			);

			if (!article) {
				throw new ActivityNotFoundException(command.where.activityId);
			}

			activity.update({
				description: command.fields?.description,
				lessonId: command.fields?.lessonId,
				name: command.fields?.name,
				order: command.fields?.order,
			});
			article.update({
				ref: command.fields?.ref,
			});

			await Promise.all([
				this.activitiesRepository.save(activity),
				this.activitiesRepository.saveArticle(article),
			]);
		} catch (err) {
			throw err;
		}
	}
}
