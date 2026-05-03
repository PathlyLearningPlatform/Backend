import {
	Exercise,
	ExerciseProgress,
	ExerciseSubmission,
} from '@/domain/exercises';
import {
	ExerciseDto,
	ExerciseProgressDto,
	ExerciseSubmissionDto,
} from './dtos';

export function aggregateToDto(aggregate: Exercise): ExerciseDto {
	return {
		id: aggregate.id.primitive(),
		name: aggregate.name,
		description: aggregate.description,
		createdAt: aggregate.createdAt,
		updatedAt: aggregate.updatedAt,
		difficulty: aggregate.difficulty,
		acceptUrl: aggregate.acceptUrl.value,
		repositoryId: aggregate.repositoryId.primitive(),
	};
}

export function progressAggregateToDto(
	aggregate: ExerciseProgress,
): ExerciseProgressDto {
	return {
		completedAt: aggregate.completedAt,
		exerciseId: aggregate.exerciseId.primitive(),
		repositoryId: aggregate.repositoryId.primitive(),
		repositoryUrl: aggregate.repositoryUrl.value,
		status: aggregate.status,
		updatedAt: aggregate.updatedAt,
		userId: aggregate.userId.toString(),
	};
}

export function submissionAggregateToDto(
	aggregate: ExerciseSubmission,
): ExerciseSubmissionDto {
	return {
		commitSha: aggregate.commitSha,
		exerciseId: aggregate.exerciseId.primitive(),
		id: aggregate.id.value.value,
		status: aggregate.status,
		submittedAt: aggregate.submittedAt,
		updatedAt: aggregate.updatedAt,
		userId: aggregate.userId.toString(),
	};
}
