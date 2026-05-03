import {
	ExerciseDifficulty,
	ExerciseStatus,
	ExerciseSubmissionStatus,
} from '@/domain/exercises';

export interface ExerciseDto {
	id: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	difficulty: ExerciseDifficulty;
	acceptUrl: string;
	repositoryId: number;
}

export interface ExerciseProgressDto {
	exerciseId: string;
	userId: string;
	completedAt: Date | null;
	updatedAt: Date | null;
	status: ExerciseStatus;
	repositoryUrl: string;
	repositoryId: number;
}

export interface ExerciseSubmissionDto {
	id: string;
	exerciseId: string;
	submittedAt: Date;
	updatedAt: Date | null;
	status: ExerciseSubmissionStatus;
	userId: string;
	commitSha: string;
}
