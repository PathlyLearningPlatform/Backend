import { Exercise } from '@/domain/exercises';
import { ExerciseDto } from './dtos';

export function aggregateToDto(aggregate: Exercise): ExerciseDto {
	return {
		id: aggregate.id.value,
		lessonId: aggregate.lessonId.value,
		name: aggregate.name.value,
		description: aggregate.description?.value ?? null,
		createdAt: aggregate.createdAt,
		updatedAt: aggregate.updatedAt,
		order: aggregate.order.value,
		type: aggregate.type,
		difficulty: aggregate.difficulty,
	};
}
