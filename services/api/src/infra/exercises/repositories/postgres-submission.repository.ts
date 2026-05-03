import {
	ExerciseSubmission,
	type FindFirstExerciseSubmissionOptions,
	type IExerciseSubmissionRepository,
	type ListExerciseSubmissionsOptions,
	type ExerciseSubmissionId,
} from '@/domain/exercises';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import { DbService } from '@/infra/db/db.service';
import { exerciseSubmissionsTable } from '@/infra/db/schemas';
import type { Db } from '@/infra/db/types';
import { Inject, Injectable } from '@nestjs/common';
import { ExerciseApiConstraints } from '../enums';

@Injectable()
export class PostgresExerciseSubmissionRepository
	implements IExerciseSubmissionRepository
{
	private db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(
		options?: ListExerciseSubmissionsOptions,
	): Promise<ExerciseSubmission[]> {
		const limit =
			options?.options?.limit ?? ExerciseApiConstraints.DEFAULT_LIMIT;
		const page = options?.options?.page ?? ExerciseApiConstraints.DEFAULT_PAGE;
		const exerciseId = options?.where?.exerciseId?.value;
		const userId = options?.where?.userId?.toString();
		const status = options?.where?.status;

		try {
			const exerciseSubmissions = await this.db
				.select()
				.from(exerciseSubmissionsTable)
				.where(
					and(
						exerciseId
							? eq(exerciseSubmissionsTable.exerciseId, exerciseId.value)
							: undefined,
						userId ? eq(exerciseSubmissionsTable.userId, userId) : undefined,
						status ? eq(exerciseSubmissionsTable.status, status) : undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);

			return exerciseSubmissions.map(ExerciseSubmission.fromDataSource);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async findFirst(
		options: FindFirstExerciseSubmissionOptions,
	): Promise<ExerciseSubmission | null> {
		const userId = options.userId;
		const exerciseId = options.exerciseId;
		const submissionId = options.submissionId;
		const status = options.status;
		const commitSha = options.commitSha;

		try {
			const [exerciseSubmission] = await this.db
				.select()
				.from(exerciseSubmissionsTable)
				.where(
					and(
						userId ? eq(exerciseSubmissionsTable.userId, userId) : undefined,
						exerciseId
							? eq(exerciseSubmissionsTable.exerciseId, exerciseId)
							: undefined,
						submissionId
							? eq(exerciseSubmissionsTable.id, submissionId)
							: undefined,
						status ? eq(exerciseSubmissionsTable.status, status) : undefined,
						commitSha
							? eq(exerciseSubmissionsTable.commitSha, commitSha)
							: undefined,
					),
				);

			if (!exerciseSubmission) {
				return null;
			}

			return ExerciseSubmission.fromDataSource(exerciseSubmission);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async findById(id: ExerciseSubmissionId): Promise<ExerciseSubmission | null> {
		try {
			const [exerciseSubmission] = await this.db
				.select()
				.from(exerciseSubmissionsTable)
				.where(eq(exerciseSubmissionsTable.id, id.value.value));

			if (!exerciseSubmission) {
				return null;
			}

			return ExerciseSubmission.fromDataSource(exerciseSubmission);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async save(aggregate: ExerciseSubmission): Promise<void> {
		try {
			await this.db
				.insert(exerciseSubmissionsTable)
				.values({
					id: aggregate.id.value.value,
					exerciseId: aggregate.exerciseId.primitive(),
					userId: aggregate.userId.toString(),
					submittedAt: aggregate.submittedAt,
					updatedAt: aggregate.updatedAt,
					status: aggregate.status,
					commitSha: aggregate.commitSha,
					conclusion: aggregate.conclusion,
				})
				.onConflictDoUpdate({
					target: exerciseSubmissionsTable.id,
					set: {
						submittedAt: aggregate.submittedAt,
						updatedAt: aggregate.updatedAt,
						status: aggregate.status,
					},
				});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async remove(id: ExerciseSubmissionId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(exerciseSubmissionsTable)
				.where(eq(exerciseSubmissionsTable.id, id.value.value));

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}
}
