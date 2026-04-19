import { Article } from '@/domain/articles';
import { ArticleDto } from './dtos';

export function aggregateToDto(aggregate: Article): ArticleDto {
	return {
		id: aggregate.id.value,
		lessonId: aggregate.lessonId.value,
		name: aggregate.name.value,
		description: aggregate.description?.value ?? null,
		createdAt: aggregate.createdAt,
		updatedAt: aggregate.updatedAt,
		order: aggregate.order.value,
		type: aggregate.type,
		ref: aggregate.ref.value,
	};
}
