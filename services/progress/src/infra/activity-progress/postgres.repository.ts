import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Db } from '../common/types';
import { IActivityProgressRepository } from '@/app/activity-progress/interfaces';
import { ActivityProgress } from '@/domain/activity-progress/entities';
import { ActivityProgressFilter } from '@/app/activity-progress/types';
import { RepositoryException } from '@pathly-backend/core/index.js';
import { activityProgressTable } from '../db/schemas';
import { dbActivityProgressToEntity } from './helpers';
import { ActivityProgressConstraints } from './enums';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class PostgresActivityProgressRepository
	implements IActivityProgressRepository
{
	private db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(filter?: ActivityProgressFilter): Promise<ActivityProgress[]> {
		const limit =
			filter?.options?.limit ?? ActivityProgressConstraints.DEFAULT_LIMIT;
		const page =
			filter?.options?.page ?? ActivityProgressConstraints.DEFAULT_PAGE;
		const userId = filter?.fields?.userId;

		try {
			const result = await this.db
				.select()
				.from(activityProgressTable)
				.where(userId ? eq(activityProgressTable.userId, userId) : undefined)
				.offset(page * limit)
				.limit(limit);

			return result.map(dbActivityProgressToEntity);
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async findOne(
		activityId: string,
		userId: string,
	): Promise<ActivityProgress | null> {
		try {
			const result = await this.db
				.select()
				.from(activityProgressTable)
				.where(
					and(
						eq(activityProgressTable.activityId, activityId),
						eq(activityProgressTable.userId, userId),
					),
				);

			return result.length > 0 ? dbActivityProgressToEntity(result[0]) : null;
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}
	async findById(id: string): Promise<ActivityProgress | null> {
		try {
			const result = await this.db
				.select()
				.from(activityProgressTable)
				.where(eq(activityProgressTable.id, id));

			return result.length > 0 ? dbActivityProgressToEntity(result[0]) : null;
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async save(entity: ActivityProgress): Promise<void> {
		try {
			await this.db
				.insert(activityProgressTable)
				.values({
					activityId: entity.activityId,
					id: entity.id,
					userId: entity.userId,
					completedAt: entity.completedAt,
				})
				.onConflictDoUpdate({
					target: activityProgressTable.id,
					set: {
						activityId: entity.activityId,
						completedAt: entity.completedAt,
						userId: entity.userId,
					},
				});
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async removeById(id: string): Promise<boolean> {
		try {
			const result = await this.db
				.delete(activityProgressTable)
				.where(eq(activityProgressTable.id, id))
				.returning();

			return result.length > 0;
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}
}
