import type { IQueryHandler, OffsetPagination } from '@/app/common';
import type { ArticleDto } from '../dtos';
import type { IActivityRepository } from '@/domain/activities';
import { aggregateToDto } from '../helpers';

type ListArticlesQuery = {
	where?: {
		lessonId?: string;
	};
	options?: OffsetPagination;
};
type ListArticlesResult = ArticleDto[];

export class ListArticlesHandler
	implements IQueryHandler<ListArticlesQuery, ListArticlesResult>
{
	constructor(private readonly activityRepository: IActivityRepository) {}

	async execute(query: ListArticlesQuery): Promise<ListArticlesResult> {
		const articles = await this.activityRepository.listArticles({
			where: {
				lessonId: query.where?.lessonId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});

		return articles.map(aggregateToDto);
	}
}
