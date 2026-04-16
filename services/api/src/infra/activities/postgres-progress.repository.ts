import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import {
	ActivityProgress,
	type ActivityProgressId,
	type ListActivityProgressOptions,
	type IActivityProgressRepository,
} from '@/domain/activities';
import type { Db } from '@/infra/db/type';
import { DbService } from '../db/db.service';
import { activityProgressTable } from '../db/schemas';
import { ActivitiesApiConstraints } from './enums';

@Injectable()
export class PostgresActivityProgressRepository
	implements IActivityProgressRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async findById(id: ActivityProgressId): Promise<ActivityProgress | null> {
		try {
			const [activityProgress] = await this.db
				.select()
				.from(activityProgressTable)
				.where(
					and(
						eq(activityProgressTable.activityId, id.activityId.value),
						eq(activityProgressTable.userId, id.userId.toString()),
					),
				);

			if (!activityProgress) {
				return null;
			}

			return ActivityProgress.fromDataSource(activityProgress);
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async save(aggregate: ActivityProgress): Promise<void> {
		try {
			await this.db
				.insert(activityProgressTable)
				.values({
					activityId: aggregate.activityId.value,
					lessonId: aggregate.lessonId.value,
					userId: aggregate.userId.value.value,
					completedAt: aggregate.completedAt,
				})
				.onConflictDoUpdate({
					target: [
						activityProgressTable.activityId,
						activityProgressTable.userId,
					],
					set: {
						completedAt: aggregate.completedAt,
					},
				});
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async remove(id: ActivityProgressId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(activityProgressTable)
				.where(
					and(
						eq(activityProgressTable.activityId, id.activityId.value),
						eq(activityProgressTable.userId, id.userId.toString()),
					),
				);

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async list(dto?: ListActivityProgressOptions): Promise<ActivityProgress[]> {
		const limit = dto?.options?.limit ?? ActivitiesApiConstraints.DEFAULT_LIMIT;
		const page = dto?.options?.page ?? ActivitiesApiConstraints.DEFAULT_PAGE;
		const userId = dto?.where?.userId;
		const lessonId = dto?.where?.lessonId;

		try {
			const rows = await this.db
				.select()
				.from(activityProgressTable)
				.where(
					and(
						lessonId ? eq(activityProgressTable.lessonId, lessonId) : undefined,
						userId ? eq(activityProgressTable.userId, userId) : undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);

			return rows.map(ActivityProgress.fromDataSource);
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}
}
