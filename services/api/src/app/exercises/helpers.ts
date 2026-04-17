import { Exercise } from '@/domain/exercises';
import { ExerciseDto } from './dtos';
import { aggregateToDto as activityAggregateToDto } from '../activities/helpers';

export function aggregateToDto(aggregate: Exercise): ExerciseDto {
	return {
		...activityAggregateToDto(aggregate),
		difficulty: aggregate.difficulty,
	};
}
