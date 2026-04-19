import { DbService } from '@/infra/db/db.service';
import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import { ActivityId } from '@/domain/activities/value-objects';
import type { Db } from '@/infra/db/type';
import { activitiesTable, exercisesTable } from '../db/schemas';
import { ActivitiesApiConstraints } from '../activities/enums';
import {
	IExerciseRepository,
	ListExercisesOptions,
} from '@/domain/exercises/repositories';
import { Exercise } from '@/domain/exercises';

@Injectable()
export class PostgresExerciseRepository implements IExerciseRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async findById(id: ActivityId): Promise<Exercise | null> {
		try {
			const [activity] = await this.db
				.select()
				.from(activitiesTable)
				.where(eq(activitiesTable.id, id.value));

			const [exercise] = await this.db
				.select()
				.from(exercisesTable)
				.where(eq(exercisesTable.activityId, id.value));

			if (!activity || !exercise) {
				return null;
			}

			return Exercise.fromDataSource({
				id: id.value,
				lessonId: activity.lessonId,
				createdAt: activity.createdAt,
				updatedAt: activity.updatedAt,
				name: activity.name,
				description: activity.description,
				order: activity.order,
				difficulty: exercise.difficulty,
			});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async list(options?: ListExercisesOptions): Promise<Exercise[]> {
		const limit =
			options?.options?.limit ?? ActivitiesApiConstraints.DEFAULT_LIMIT;
		const page =
			options?.options?.page ?? ActivitiesApiConstraints.DEFAULT_PAGE;

		try {
			const result = await this.db
				.select()
				.from(activitiesTable)
				.innerJoin(
					exercisesTable,
					eq(activitiesTable.id, exercisesTable.activityId),
				)
				.where(
					and(
						options?.where?.lessonId
							? eq(activitiesTable.lessonId, options.where.lessonId)
							: undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);

			return result.map((item) =>
				Exercise.fromDataSource({
					id: item.exercises.activityId,
					createdAt: item.activities.createdAt,
					description: item.activities.description,
					lessonId: item.activities.lessonId,
					name: item.activities.name,
					order: item.activities.order,
					difficulty: item.exercises.difficulty,
					updatedAt: item.activities.updatedAt,
				}),
			);
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async remove(id: ActivityId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(activitiesTable)
				.where(eq(activitiesTable.id, id.value));

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async save(aggregate: Exercise): Promise<void> {
		try {
			await this.db.transaction(async (tx) => {
				await tx
					.insert(activitiesTable)
					.values({
						id: aggregate.id.value,
						lessonId: aggregate.lessonId.value,
						name: aggregate.name.value,
						description: aggregate.description?.value ?? null,
						order: aggregate.order.value,
						type: aggregate.type,
						createdAt: aggregate.createdAt,
						updatedAt: aggregate.updatedAt,
					})
					.onConflictDoUpdate({
						target: activitiesTable.id,
						set: {
							name: aggregate.name.value,
							description: aggregate.description?.value ?? null,
							order: aggregate.order.value,
							updatedAt: aggregate.updatedAt,
						},
					});

				await tx
					.insert(exercisesTable)
					.values({
						difficulty: aggregate.difficulty,
						activityId: aggregate.id.value,
					})
					.onConflictDoNothing({
						target: exercisesTable.activityId,
					});
			});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}
}
