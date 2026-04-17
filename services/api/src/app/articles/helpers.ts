import { Article } from '@/domain/articles';
import { ArticleDto } from './dtos';
import { aggregateToDto as activityAggregateToDto } from '../activities/helpers';

export function aggregateToDto(aggregate: Article): ArticleDto {
	return {
		...activityAggregateToDto(aggregate),
		ref: aggregate.ref.value,
	};
}
