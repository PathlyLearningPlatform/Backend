import type { ArticleCreateFields } from '@/domain/activities/entities';

export type CreateArticleCommand = Omit<ArticleCreateFields, 'type' | 'id'>;
