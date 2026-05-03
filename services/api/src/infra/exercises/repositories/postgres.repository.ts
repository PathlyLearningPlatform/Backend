import {
	Exercise,
	type IExerciseRepository,
	type ListExercisesOptions,
	type ExerciseId,
} from '@/domain/exercises';
import { DbException } from '@infra/common';
import { eq } from 'drizzle-orm';
import { DbService } from '@/infra/db/db.service';
import { exercisesTable } from '@/infra/db/schemas';
import type { Db } from '@/infra/db/types';
import { Inject, Injectable } from '@nestjs/common';
import { ExerciseApiConstraints } from '../enums';
import { RepositoryId } from '@/domain/common';

@Injectable()
export class PostgresExerciseRepository implements IExerciseRepository {
	private db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(options?: ListExercisesOptions): Promise<Exercise[]> {
		const limit =
			options?.options?.limit ?? ExerciseApiConstraints.DEFAULT_LIMIT;
		const page = options?.options?.page ?? ExerciseApiConstraints.DEFAULT_PAGE;

		try {
			const exercises = await this.db
				.select()
				.from(exercisesTable)
				.limit(limit)
				.offset(page * limit);

			return exercises.map(Exercise.fromDataSource);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async findById(id: ExerciseId): Promise<Exercise | null> {
		try {
			const [exercise] = await this.db
				.select()
				.from(exercisesTable)
				.where(eq(exercisesTable.id, id.primitive()));

			if (!exercise) {
				return null;
			}

			return Exercise.fromDataSource(exercise);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async findByRepositoryId(id: RepositoryId): Promise<Exercise | null> {
		try {
			const [exercise] = await this.db
				.select()
				.from(exercisesTable)
				.where(eq(exercisesTable.repositoryId, id.value));

			if (!exercise) {
				return null;
			}

			return Exercise.fromDataSource(exercise);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async save(aggregate: Exercise): Promise<void> {
		try {
			await this.db
				.insert(exercisesTable)
				.values({
					id: aggregate.id.primitive(),
					name: aggregate.name,
					description: aggregate.description,
					acceptUrl: aggregate.acceptUrl.value,
					createdAt: aggregate.createdAt,
					updatedAt: aggregate.updatedAt,
					repositoryId: aggregate.repositoryId.value,
					difficulty: aggregate.difficulty,
				})
				.onConflictDoUpdate({
					target: exercisesTable.id,
					set: {
						name: aggregate.name,
						description: aggregate.description,
						acceptUrl: aggregate.acceptUrl.value,
						updatedAt: aggregate.updatedAt,
					},
				});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async remove(id: ExerciseId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(exercisesTable)
				.where(eq(exercisesTable.id, id.primitive()));

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}
}
