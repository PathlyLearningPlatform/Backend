import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import type {
	LearningPathProgressDto,
	ListLearningPathProgressDto,
} from '@/app/learning-paths/dtos';
import type { ILearningPathProgressReadRepository } from '@/app/learning-paths/interfaces';
import type { Db } from '@/infra/db/type';
import { DbService } from '../db/db.service';
import { learningPathProgressTable } from '../db/schemas';
import { LearningPathsApiConstraints } from './enums';

@Injectable()
export class PostgresLearningPathProgressReadRepository
	implements ILearningPathProgressReadRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(
		dto?: ListLearningPathProgressDto,
	): Promise<LearningPathProgressDto[]> {
		const limit =
			dto?.options?.limit ?? LearningPathsApiConstraints.DEFAULT_LIMIT;
		const page = dto?.options?.page ?? LearningPathsApiConstraints.DEFAULT_PAGE;
		const userId = dto?.where?.userId;

		try {
			return await this.db
				.select()
				.from(learningPathProgressTable)
				.where(
					and(
						userId ? eq(learningPathProgressTable.userId, userId) : undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async findById(id: string): Promise<LearningPathProgressDto | null> {
		try {
			const [learningPathProgress] = await this.db
				.select()
				.from(learningPathProgressTable)
				.where(eq(learningPathProgressTable.id, id));

			return learningPathProgress ?? null;
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async findOneForUser(
		learningPathId: string,
		userId: string,
	): Promise<LearningPathProgressDto | null> {
		try {
			const [learningPathProgress] = await this.db
				.select()
				.from(learningPathProgressTable)
				.where(
					and(
						eq(learningPathProgressTable.learningPathId, learningPathId),
						eq(learningPathProgressTable.userId, userId),
					),
				);

			return learningPathProgress ?? null;
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}
}
