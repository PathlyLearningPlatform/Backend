import { Article } from '@/domain/articles';
import { ArticleDto } from './dtos';

export function aggregateToDto(aggregate: Article): ArticleDto {
	return {
		id: aggregate.id.primitive(),
		name: aggregate.name,
		description: aggregate.description,
		ref: aggregate.ref.value,
		createdAt: aggregate.createdAt,
		updatedAt: aggregate.updatedAt,
	};
}
