import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import { UpdateArticleCommand } from '../commands/update-article.command';
import { IActivitiesRepository } from '../interfaces';
import { Article } from '@/domain/activities/entities';

export class UpdateArticleUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: UpdateArticleCommand): Promise<Article> {
		const article = await this.activitiesRepository.findOneArticle(
			command.where.activityId,
		);

		if (!article) {
			throw new ActivityNotFoundException(command.where.activityId);
		}

		article.update({
			description: command.fields?.description,
			lessonId: command.fields?.lessonId,
			name: command.fields?.name,
			order: command.fields?.order,
			ref: command.fields?.ref,
		});

		await this.activitiesRepository.saveArticle(article);

		return article;
	}
}
