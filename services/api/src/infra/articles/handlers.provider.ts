import type { Provider } from '@nestjs/common';
import {
	UpdateArticleHandler,
	FindArticleByIdHandler,
	ListArticlesHandler,
	CreateArticleHandler,
	RemoveArticleHandler,
} from '@app/articles';
import { DiToken } from '@infra/common';
import { PostgresArticleRepository } from './postgres.repository';
import { IArticleRepository } from '@/domain/articles/repositories';
import { RemoveActivityHandler } from '@/app/activities/commands';

export const articleHandlersProvider: Provider[] = [
	// ──────────────────────────────────────────────
	// Queries
	// ──────────────────────────────────────────────
	{
		provide: DiToken.LIST_ARTICLES_HANDLER,
		useFactory(articleRepository: IArticleRepository) {
			return new ListArticlesHandler(articleRepository);
		},
		inject: [PostgresArticleRepository],
	},
	{
		provide: DiToken.FIND_ARTICLE_BY_ID_HANDLER,
		useFactory(articleRepository: IArticleRepository) {
			return new FindArticleByIdHandler(articleRepository);
		},
		inject: [PostgresArticleRepository],
	},
	// ──────────────────────────────────────────────
	// Commands
	// ──────────────────────────────────────────────
	{
		provide: DiToken.UPDATE_ARTICLE_HANDLER,
		useFactory(articleRepository: IArticleRepository) {
			return new UpdateArticleHandler(articleRepository);
		},
		inject: [PostgresArticleRepository],
	},
	{
		provide: DiToken.CREATE_ARTICLE_HANDLER,
		useFactory(articleRepository: IArticleRepository) {
			return new CreateArticleHandler(articleRepository);
		},
		inject: [PostgresArticleRepository],
	},
	{
		provide: DiToken.REMOVE_ARTICLE_HANDLER,
		useFactory(articleRepository: IArticleRepository) {
			return new RemoveArticleHandler(articleRepository);
		},
		inject: [PostgresArticleRepository],
	},
];
