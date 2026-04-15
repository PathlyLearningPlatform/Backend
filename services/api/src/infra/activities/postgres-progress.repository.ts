import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import {
	ActivityProgress,
	type ActivityProgressId,
	type IActivityProgressRepository,
} from '@/domain/activities';
import type { Db } from '@/infra/db/type';
import { DbService } from '../db/db.service';
import { activityProgressTable } from '../db/schemas';

@Injectable()
export class PostgresActivityProgressRepository
	implements IActivityProgressRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async load(id: ActivityProgressId): Promise<ActivityProgress | null> {
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

			return ActivityProgress.fromDataSource({
				activityId: activityProgress.activityId,
				lessonId: activityProgress.lessonId,
				userId: activityProgress.userId,
				completedAt: activityProgress.completedAt,
			});
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
}
