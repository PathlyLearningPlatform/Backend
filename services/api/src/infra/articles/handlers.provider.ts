import type { Provider } from '@nestjs/common';
import {
	UpdateArticleHandler,
	FindArticleByIdHandler,
	ListArticlesHandler,
	AddArticleHandler,
} from '@app/articles';
import type { IActivityRepository } from '@/domain/activities';
import type { ILessonRepository } from '@/domain/lessons/repositories';
import { DiToken } from '@infra/common';
import { PostgresLessonRepository } from '../lessons/postgres.repository';
import { PostgresActivityRepository } from '@infra/activities/postgres.repository';

export const articleHandlersProvider: Provider[] = [
	// ──────────────────────────────────────────────
	// Queries
	// ──────────────────────────────────────────────
	{
		provide: DiToken.LIST_ARTICLES_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new ListArticlesHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.FIND_ARTICLE_BY_ID_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new FindArticleByIdHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	// ──────────────────────────────────────────────
	// Commands
	// ──────────────────────────────────────────────
	{
		provide: DiToken.UPDATE_ARTICLE_HANDLER,
		useFactory(activityRepository: IActivityRepository) {
			return new UpdateArticleHandler(activityRepository);
		},
		inject: [PostgresActivityRepository],
	},
	{
		provide: DiToken.ADD_ARTICLE_HANDLER,
		useFactory(
			lessonRepository: ILessonRepository,
			activityRepository: IActivityRepository,
		) {
			return new AddArticleHandler(lessonRepository, activityRepository);
		},
		inject: [PostgresLessonRepository, PostgresActivityRepository],
	},
];
