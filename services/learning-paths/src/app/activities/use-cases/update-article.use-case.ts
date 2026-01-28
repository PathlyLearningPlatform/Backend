import type { Article } from '@/domain/activities/entities';
import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import type { UpdateArticleCommand } from '../commands/update-article.command';
import type { IActivitiesRepository } from '../interfaces';

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
