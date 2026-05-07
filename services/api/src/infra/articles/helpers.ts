import { ArticleDto } from '@/app/articles';
import { ArticleResponseDto } from './dtos/response.dto';

export function clientArticleToResponseDto(
	article: ArticleDto,
): ArticleResponseDto {
	return {
		id: article.id,
		createdAt: article.createdAt.toISOString(),
		name: article.name,
		ref: article.ref,
		description: article.description,
		updatedAt: article.updatedAt ? article.updatedAt.toISOString() : null,
	};
}
