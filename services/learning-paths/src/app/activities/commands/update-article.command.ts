import type { ArticleUpdateFields } from '@/domain/activities/entities';

export type UpdateArticleCommand = {
	where: {
		activityId: string;
	};
	fields?: ArticleUpdateFields;
};
