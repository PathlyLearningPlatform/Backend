import {
	ActivityCreateFields,
	ArticleCreateFields,
} from '@/domain/activities/entities';

export type CreateArticleCommand = Omit<
	ArticleCreateFields & ActivityCreateFields,
	'type' | 'activityId'
>;
