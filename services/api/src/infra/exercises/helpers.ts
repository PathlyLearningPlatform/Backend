import type { ExerciseDto } from '@/app/exercises';
import type { ExerciseResponseDto } from './dtos/response.dto';
import type { ActivityType, ExerciseDifficulty } from '../activities/enums';

export function clientExerciseToResponseDto(
	exercise: ExerciseDto,
): ExerciseResponseDto {
	return {
		id: exercise.id,
		lessonId: exercise.lessonId,
		createdAt: exercise.createdAt.toISOString(),
		name: exercise.name,
		order: exercise.order,
		difficulty: exercise.difficulty as ExerciseDifficulty,
		type: exercise.type as ActivityType,
		description: exercise.description,
		updatedAt: exercise.updatedAt ? exercise.updatedAt.toISOString() : null,
	};
}
