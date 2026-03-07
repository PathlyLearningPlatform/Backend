import { IQueryHandler, OffsetPagination } from '@/app/common';
import { IActivityReadRepository } from '../interfaces';
import { ArticleDto } from '../dtos';

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
	constructor(
		private readonly activityReadRepository: IActivityReadRepository,
	) {}

	async execute(query: ListArticlesQuery): Promise<ListArticlesResult> {
		return this.activityReadRepository.listArticles({
			where: {
				lessonId: query.where?.lessonId,
			},
			options: {
				limit: query.options?.limit,
				page: query.options?.page,
			},
		});
	}
}
