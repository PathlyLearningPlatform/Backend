import type { ArticleCreateProps } from '@/domain/activities/entities';

export type CreateArticleCommand = Omit<ArticleCreateProps, 'type' | 'id'>;
