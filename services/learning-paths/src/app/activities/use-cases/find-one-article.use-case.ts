import type { Article } from '@/domain/activities/entities';
import { ActivityNotFoundException } from '@/domain/activities/exceptions';
import type { IActivitiesRepository } from '../interfaces';

export class FindOneArticleUseCase {
	constructor(private readonly activitiesRepository: IActivitiesRepository) {}

	async execute(activityId: string): Promise<Article> {
		const article = await this.activitiesRepository.findOneArticle(activityId);

		if (!article) {
			throw new ActivityNotFoundException(activityId);
		}

		return article;
	}
}
