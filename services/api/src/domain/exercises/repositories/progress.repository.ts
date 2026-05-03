import { UserId, RepositoryId } from '@/domain/common';
import { ExerciseProgress } from '../progress.aggregate';
import { ExerciseProgressId, ExerciseStatus } from '../value-objects';

export type ListExerciseProgressOptions = {
	options?: Partial<{
		limit: number;
		page: number;
	}>;
	where?: Partial<{
		exerciseId: string;
		userId: string;
		status: ExerciseStatus;
	}>;
};

export type FindFirstExerciseProgressOptions = Partial<{
	exerciseId: string;
	userId: string;
	status: ExerciseStatus;
	repositoryId: number;
}>;

export interface IExerciseProgressRepository {
	list(options?: ListExerciseProgressOptions): Promise<ExerciseProgress[]>;

	findById(id: ExerciseProgressId): Promise<ExerciseProgress | null>;

	findFirst(
		options: FindFirstExerciseProgressOptions,
	): Promise<ExerciseProgress | null>;

	save(aggregate: ExerciseProgress): Promise<void>;

	remove(id: ExerciseProgressId): Promise<boolean>;
}
