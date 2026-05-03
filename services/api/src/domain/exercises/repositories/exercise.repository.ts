import { ActivityId } from '@/domain/activities';
import { Exercise } from '../exercise.aggregate';
import { RepositoryId } from '@/domain/common';

export type ListExercisesOptions = Partial<{
	where: Partial<{
		lessonId: string;
	}>;
	options: Partial<{
		limit: number;
		page: number;
	}>;
}>;

export interface IExerciseRepository {
	list(options?: ListExercisesOptions): Promise<Exercise[]>;

	findById(id: ActivityId): Promise<Exercise | null>;

	findByRepositoryId(id: RepositoryId): Promise<Exercise | null>;

	save(aggregate: Exercise): Promise<void>;

	remove(id: ActivityId): Promise<boolean>;
}
