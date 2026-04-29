import { DbService } from '@/infra/db/db.service';
import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import type { Order } from '@/domain/common';
import { Activity } from '@/domain/activities/activity.aggregate';
import type { LessonId } from '@/domain/lessons';
import type { IActivityRepository } from '@/domain/activities/repositories';
import type { ListActivitiesOptions } from '@/domain/activities/repositories';
import { ActivityId } from '@/domain/activities/value-objects';
import type { Db } from '@/infra/db/types';
import { activitiesTable } from '../db/schemas';
import { ActivitiesApiConstraints } from './enums';

@Injectable()
export class PostgresActivityRepository implements IActivityRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async findById(id: ActivityId): Promise<Activity | null> {
		const rawId = id.value;

		try {
			const result = await this.db.transaction(async (tx) => {
				const [dbActivity] = await tx
					.select()
					.from(activitiesTable)
					.where(eq(activitiesTable.id, rawId));

				if (!dbActivity) {
					return null;
				}

				return Activity.fromDataSource(dbActivity);
			});

			return result;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async findByLessonIdAndOrder(
		lessonId: LessonId,
		order: Order,
	): Promise<Activity | null> {
		try {
			const result = await this.db.transaction(async (tx) => {
				const [dbActivity] = await tx
					.select()
					.from(activitiesTable)
					.where(
						and(
							eq(activitiesTable.lessonId, lessonId.value),
							eq(activitiesTable.order, order.value),
						),
					);

				if (!dbActivity) {
					return null;
				}

				return Activity.fromDataSource(dbActivity);
			});

			return result;
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}

	async list(options?: ListActivitiesOptions): Promise<Activity[]> {
		const limit =
			options?.options?.limit ?? ActivitiesApiConstraints.DEFAULT_LIMIT;
		const page =
			options?.options?.page ?? ActivitiesApiConstraints.DEFAULT_PAGE;
		const lessonId = options?.where?.lessonId;

		const activities = await this.db
			.select()
			.from(activitiesTable)
			.where(lessonId ? eq(activitiesTable.lessonId, lessonId) : undefined)
			.limit(limit)
			.offset(page * limit);

		return activities.map(Activity.fromDataSource);
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

	async save(aggregate: Activity): Promise<void> {
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
			});
		} catch (err) {
			throw new DbException('postgres exception', err);
		}
	}
}
