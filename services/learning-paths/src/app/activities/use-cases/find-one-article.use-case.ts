import { Article } from '@/domain/activities/entities';
import { IActivitiesRepository } from '../interfaces';
import { ActivityNotFoundException } from '@/domain/activities/exceptions';

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
