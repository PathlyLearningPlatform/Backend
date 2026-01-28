import type { ArticleUpdateProps } from '@/domain/activities/entities';

export type UpdateArticleCommand = {
	where: {
		activityId: string;
	};
	fields?: ArticleUpdateProps;
};
