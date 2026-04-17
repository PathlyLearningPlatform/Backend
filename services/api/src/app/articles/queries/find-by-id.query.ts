import { ActivityNotFoundException, type IQueryHandler } from '@/app/common';
import { ActivityId, IActivityRepository } from '@/domain/activities';
import type { ArticleDto } from '../dtos';
import { aggregateToDto } from '../helpers';

type FindArticleByIdQuery = {
	where: {
		id: string;
	};
};
type FindArticleByIdResult = ArticleDto;

export class FindArticleByIdHandler
	implements IQueryHandler<FindArticleByIdQuery, FindArticleByIdResult>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(query: FindArticleByIdQuery): Promise<FindArticleByIdResult> {
		const activityId = ActivityId.create(query.where.id);
		const article = await this.activityRepository.findArticleById(activityId);

		if (!article) {
			throw new ActivityNotFoundException(query.where.id);
		}

		return aggregateToDto(article);
	}
}
