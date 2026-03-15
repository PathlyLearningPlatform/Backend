import {
	ActivityProgress,
	ActivityProgressId,
	IActivityProgressRepository,
} from '@/domain/activity-progress';
import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '@infra/common/db/db.service';
import { Db } from '../common/db/types';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { activityProgressTable } from '../common/db/schemas';
import { eq } from 'drizzle-orm';

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
				.where(eq(activityProgressTable.id, id.toString()));

			if (!activityProgress) {
				return null;
			}

			return ActivityProgress.fromDataSource({
				id: activityProgress.id,
				activityId: activityProgress.activityId,
				userId: activityProgress.userId,
				lessonId: activityProgress.lessonId,
				completedAt: activityProgress.completedAt,
			});
		} catch (err) {
			throw new RepositoryException('drizzle error', err);
		}
	}

	async save(aggregate: ActivityProgress): Promise<void> {
		try {
			await this.db
				.insert(activityProgressTable)
				.values({
					id: aggregate.id.toString(),
					activityId: aggregate.activityId.toString(),
					lessonId: aggregate.lessonId.toString(),
					userId: aggregate.userId.toString(),
					completedAt: aggregate.completedAt,
				})
				.onConflictDoUpdate({
					target: activityProgressTable.id,
					set: {
						completedAt: aggregate.completedAt,
					},
				});
		} catch (err) {
			throw new RepositoryException('drizzle error', err);
		}
	}

	async remove(id: ActivityProgressId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(activityProgressTable)
				.where(eq(activityProgressTable.id, id.toString()));

			return result.rows.length > 0;
		} catch (err) {
			throw new RepositoryException('drizzle error', err);
		}
	}
}
