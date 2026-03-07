import { IQueryHandler, ActivityNotFoundException } from '@/app/common';
import { IActivityReadRepository } from '../interfaces';
import { ArticleDto } from '../dtos';

type FindArticleByIdQuery = {
	where: {
		id: string;
	};
};
type FindArticleByIdResult = ArticleDto;

export class FindArticleByIdHandler
	implements IQueryHandler<FindArticleByIdQuery, FindArticleByIdResult>
{
	constructor(
		private readonly activityReadRepository: IActivityReadRepository,
	) {}

	async execute(query: FindArticleByIdQuery): Promise<FindArticleByIdResult> {
		const article = await this.activityReadRepository.findArticleById(
			query.where.id,
		);

		if (!article) {
			throw new ActivityNotFoundException(query.where.id);
		}

		return article;
	}
}
