import { ActivityType } from '@/domain/activities/enums';
import { CreateArticleCommand } from '../commands/create-article.command';
import { IActivitiesRepository } from '../interfaces';
import { Activity, Article } from '@/domain/activities/entities';
import { randomUUID } from 'crypto';

export class CreateArticleUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(command: CreateArticleCommand) {
		try {
			const activity = new Activity({
				id: randomUUID(),
				lessonId: command.lessonId,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				name: command.name,
				order: command.order,
				type: ActivityType.ARTICLE,
				description: command.description || null,
			});
			const article = new Article({
				activityId: activity.id,
				ref: command.ref,
			});

			await this.activitiesRepository.save(activity);
			await this.activitiesRepository.saveArticle(article);
		} catch (err) {
			throw err;
		}
	}
}
