import {
	ListActivityProgressDto,
	ActivityProgressDto,
} from '@/app/activity-progress/dtos';
import { IActivityProgressReadRepository } from '@/app/activity-progress/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../common/db/db.service';
import { Db } from '../common/db/types';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { ActivityProgressConstraints } from './enums';
import { activityProgressTable } from '../common/db/schemas';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class PostgresActivityProgressReadRepository
	implements IActivityProgressReadRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(dto: ListActivityProgressDto): Promise<ActivityProgressDto[]> {
		const limit =
			dto.options?.limit ?? ActivityProgressConstraints.DEFAULT_LIMIT;
		const page = dto.options?.page ?? ActivityProgressConstraints.DEFAULT_PAGE;
		const userId = dto.where?.userId;
		const lessonId = dto.where?.lessonId;

		try {
			const result = await this.db
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

			return result;
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}

	async findById(id: string): Promise<ActivityProgressDto | null> {
		try {
			const [activityProgress] = await this.db
				.select()
				.from(activityProgressTable)
				.where(eq(activityProgressTable.id, id));

			return activityProgress ?? null;
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}

	async findForUser(
		activityId: string,
		userId: string,
	): Promise<ActivityProgressDto | null> {
		try {
			const [activityProgress] = await this.db
				.select()
				.from(activityProgressTable)
				.where(
					and(
						eq(activityProgressTable.activityId, activityId),
						eq(activityProgressTable.userId, userId),
					),
				);

			return activityProgress ?? null;
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}
}
