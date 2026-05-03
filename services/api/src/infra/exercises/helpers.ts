import type {
	ExerciseDto,
	ExerciseProgressDto,
	ExerciseSubmissionDto,
} from '@/app/exercises';
import type {
	ExerciseProgressResponseDto,
	ExerciseResponseDto,
	ExerciseSubmissionResponseDto,
} from './dtos/response.dto';
import type { ExerciseDifficulty } from '../activities/enums';

export function dtoToClient(exercise: ExerciseDto): ExerciseResponseDto {
	return {
		id: exercise.id,
		createdAt: exercise.createdAt.toISOString(),
		name: exercise.name,
		difficulty: exercise.difficulty as ExerciseDifficulty,
		description: exercise.description,
		updatedAt: exercise.updatedAt ? exercise.updatedAt.toISOString() : null,
		acceptUrl: exercise.acceptUrl,
		repositoryId: exercise.repositoryId,
	};
}

export function progressDtoToClient(
	dto: ExerciseProgressDto,
): ExerciseProgressResponseDto {
	return {
		completedAt: dto.completedAt ? dto.completedAt.toISOString() : null,
		exerciseId: dto.exerciseId,
		repositoryUrl: dto.repositoryUrl,
		status: dto.status,
		updatedAt: dto.updatedAt ? dto.updatedAt.toISOString() : null,
		userId: dto.userId,
		repositoryId: dto.repositoryId,
	};
}

export function submissionDtoToClient(
	dto: ExerciseSubmissionDto,
): ExerciseSubmissionResponseDto {
	return {
		id: dto.id,
		exerciseId: dto.exerciseId,
		status: dto.status,
		submittedAt: dto.submittedAt.toISOString(),
		updatedAt: dto.updatedAt ? dto.updatedAt.toISOString() : null,
		userId: dto.userId,
		commitSha: dto.commitSha,
	};
}
