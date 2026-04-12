import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import type {
	ActivityProgressDto,
	ListActivityProgressDto,
} from '@/app/activities/dtos';
import type { IActivityProgressReadRepository } from '@/app/activities/interfaces';
import type { Db } from '@/infra/db/type';
import { DbService } from '../db/db.service';
import { activityProgressTable } from '../db/schemas';
import { ActivitiesApiConstraints } from './enums';

@Injectable()
export class PostgresActivityProgressReadRepository
	implements IActivityProgressReadRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(dto: ListActivityProgressDto): Promise<ActivityProgressDto[]> {
		const limit = dto.options?.limit ?? ActivitiesApiConstraints.DEFAULT_LIMIT;
		const page = dto.options?.page ?? ActivitiesApiConstraints.DEFAULT_PAGE;
		const userId = dto.where?.userId;
		const lessonId = dto.where?.lessonId;

		try {
			return await this.db
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
		} catch (err) {
			throw new DbException('drizzle err', err);
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
			throw new DbException('drizzle err', err);
		}
	}

	async findOneForUser(
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
			throw new DbException('drizzle err', err);
		}
	}
}
