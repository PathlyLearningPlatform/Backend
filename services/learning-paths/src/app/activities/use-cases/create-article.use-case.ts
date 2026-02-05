import { randomUUID } from 'crypto';
import { Article } from '@/domain/activities/entities';
import { ActivityType } from '@/domain/activities/enums';
import type { CreateArticleCommand } from '../commands/create-article.command';
import type { IActivitiesRepository } from '../interfaces';

export class CreateArticleUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: CreateArticleCommand): Promise<Article> {
		const article = new Article({
			id: randomUUID(),
			lessonId: command.lessonId,
			createdAt: new Date(),
			updatedAt: new Date(),
			name: command.name,
			order: command.order,
			type: ActivityType.ARTICLE,
			description: command.description || null,
			ref: command.ref,
		});

		await this.activitiesRepository.saveArticle(article);

		return article;
	}
}
