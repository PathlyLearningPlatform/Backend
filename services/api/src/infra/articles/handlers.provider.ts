import type { Provider } from '@nestjs/common';
import {
	UpdateArticleHandler,
	FindArticleByIdHandler,
	ListArticlesHandler,
	AddArticleHandler,
} from '@app/articles';
import type { ILessonRepository } from '@/domain/lessons/repositories';
import { DiToken } from '@infra/common';
import { PostgresLessonRepository } from '../lessons/postgres.repository';
import { PostgresArticleRepository } from './postgres.repository';
import { IArticleRepository } from '@/domain/articles/repositories';

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
		provide: DiToken.ADD_ARTICLE_HANDLER,
		useFactory(
			lessonRepository: ILessonRepository,
			articleRepository: IArticleRepository,
		) {
			return new AddArticleHandler(lessonRepository, articleRepository);
		},
		inject: [PostgresLessonRepository, PostgresArticleRepository],
	},
];
