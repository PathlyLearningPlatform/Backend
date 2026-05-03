import { UserId } from '@/domain/common';
import { ExerciseSubmission } from '../submission.aggregate';
import {
	ExerciseId,
	ExerciseSubmissionId,
	ExerciseSubmissionStatus,
} from '../value-objects';

export type ListExerciseSubmissionsOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
	where?: Partial<{
		exerciseId: ExerciseId;
		userId: UserId;
		status: ExerciseSubmissionStatus;
	}>;
};

export type FindFirstExerciseSubmissionOptions = Partial<{
	userId: string;
	exerciseId: string;
	submissionId: string;
	commitSha: string;
	status: ExerciseSubmissionStatus;
}>;

export interface IExerciseSubmissionRepository {
	list(options?: ListExerciseSubmissionsOptions): Promise<ExerciseSubmission[]>;

	findById(id: ExerciseSubmissionId): Promise<ExerciseSubmission | null>;

	findFirst(
		options: FindFirstExerciseSubmissionOptions,
	): Promise<ExerciseSubmission | null>;

	save(aggregate: ExerciseSubmission): Promise<void>;

	remove(id: ExerciseSubmissionId): Promise<boolean>;
}
