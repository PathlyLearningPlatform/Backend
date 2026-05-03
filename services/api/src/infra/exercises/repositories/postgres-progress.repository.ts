import {
	ExerciseProgress,
	type IExerciseProgressRepository,
	type ListExerciseProgressOptions,
	type ExerciseProgressId,
	FindFirstExerciseProgressOptions,
} from '@/domain/exercises';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import { DbService } from '@/infra/db/db.service';
import { exerciseProgressTable } from '@/infra/db/schemas';
import type { Db } from '@/infra/db/types';
import { Inject, Injectable } from '@nestjs/common';
import { ExerciseApiConstraints } from '../enums';
import { UserId, RepositoryId } from '@/domain/common';

@Injectable()
export class PostgresExerciseProgressRepository
	implements IExerciseProgressRepository
{
	private db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(
		options?: ListExerciseProgressOptions,
	): Promise<ExerciseProgress[]> {
		const limit =
			options?.options?.limit ?? ExerciseApiConstraints.DEFAULT_LIMIT;
		const page = options?.options?.page ?? ExerciseApiConstraints.DEFAULT_PAGE;
		const exerciseId = options?.where?.exerciseId;
		const userId = options?.where?.userId;
		const status = options?.where?.status;

		try {
			const exerciseProgress = await this.db
				.select()
				.from(exerciseProgressTable)
				.where(
					and(
						exerciseId
							? eq(exerciseProgressTable.exerciseId, exerciseId)
							: undefined,
						userId ? eq(exerciseProgressTable.userId, userId) : undefined,
						status ? eq(exerciseProgressTable.status, status) : undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);

			return exerciseProgress.map(ExerciseProgress.fromDataSource);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async findById(id: ExerciseProgressId): Promise<ExerciseProgress | null> {
		try {
			const [exerciseProgress] = await this.db
				.select()
				.from(exerciseProgressTable)
				.where(
					and(
						eq(exerciseProgressTable.exerciseId, id.exerciseId.value.value),
						eq(exerciseProgressTable.userId, id.userId.toString()),
					),
				);

			if (!exerciseProgress) {
				return null;
			}

			return ExerciseProgress.fromDataSource(exerciseProgress);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async findFirst(
		options: FindFirstExerciseProgressOptions,
	): Promise<ExerciseProgress | null> {
		const userId = options.userId;
		const repositoryId = options.repositoryId;
		const exerciseId = options.exerciseId;
		const status = options.status;

		try {
			const [exerciseProgress] = await this.db
				.select()
				.from(exerciseProgressTable)
				.where(
					and(
						repositoryId
							? eq(exerciseProgressTable.repositoryId, repositoryId)
							: undefined,
						userId ? eq(exerciseProgressTable.userId, userId) : undefined,
						exerciseId
							? eq(exerciseProgressTable.exerciseId, exerciseId)
							: undefined,
						status ? eq(exerciseProgressTable.status, status) : undefined,
					),
				);

			if (!exerciseProgress) {
				return null;
			}

			return ExerciseProgress.fromDataSource(exerciseProgress);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async findByRepositoryIdForUser(
		id: RepositoryId,
		userId: UserId,
	): Promise<ExerciseProgress | null> {
		try {
			const [exerciseProgress] = await this.db
				.select()
				.from(exerciseProgressTable)
				.where(
					and(
						eq(exerciseProgressTable.repositoryId, id.value),
						eq(exerciseProgressTable.userId, userId.toString()),
					),
				);

			if (!exerciseProgress) {
				return null;
			}

			return ExerciseProgress.fromDataSource(exerciseProgress);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async save(aggregate: ExerciseProgress): Promise<void> {
		try {
			await this.db
				.insert(exerciseProgressTable)
				.values({
					exerciseId: aggregate.exerciseId.primitive(),
					userId: aggregate.userId.toString(),
					completedAt: aggregate.completedAt,
					updatedAt: aggregate.updatedAt,
					status: aggregate.status,
					repositoryUrl: aggregate.repositoryUrl.value,
					repositoryId: aggregate.repositoryId.value,
				})
				.onConflictDoUpdate({
					target: [
						exerciseProgressTable.exerciseId,
						exerciseProgressTable.userId,
					],
					set: {
						completedAt: aggregate.completedAt,
						updatedAt: aggregate.updatedAt,
						status: aggregate.status,
						repositoryUrl: aggregate.repositoryUrl.value,
					},
				});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async remove(id: ExerciseProgressId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(exerciseProgressTable)
				.where(
					and(
						eq(exerciseProgressTable.exerciseId, id.exerciseId.primitive()),
						eq(exerciseProgressTable.userId, id.userId.toString()),
					),
				);

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}
}
