import { ArticleDto } from '@/app/articles';
import { ArticleResponseDto } from './dtos/response.dto';
import { ActivityType } from '../activities/enums';

export function clientArticleToResponseDto(
	article: ArticleDto,
): ArticleResponseDto {
	return {
		id: article.id,
		lessonId: article.lessonId,
		createdAt: article.createdAt.toISOString(),
		name: article.name,
		order: article.order,
		ref: article.ref,
		type: ActivityType.ARTICLE,
		description: article.description,
		updatedAt: article.updatedAt ? article.updatedAt.toISOString() : null,
	};
}
