import { Exercise } from '../exercise.aggregate';
import { RepositoryId } from '@/domain/common';
import { ExerciseId } from '../value-objects';

export type ListExercisesOptions = Partial<{
	options: Partial<{
		limit: number;
		page: number;
	}>;
}>;

export interface IExerciseRepository {
	list(options?: ListExercisesOptions): Promise<Exercise[]>;

	findById(id: ExerciseId): Promise<Exercise | null>;

	findByRepositoryId(id: RepositoryId): Promise<Exercise | null>;

	save(aggregate: Exercise): Promise<void>;

	remove(id: ExerciseId): Promise<boolean>;
}
