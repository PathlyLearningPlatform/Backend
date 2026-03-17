import type {
	LearningPathProgressDto,
	ListLearningPathProgressDto,
} from '@/app/learning-path-progress/dtos';
import type { ILearningPathProgressReadRepository } from '@/app/learning-path-progress/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../common/db/db.service';
import type { Db } from '../common/db/types';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { learningPathProgressTable } from '../common/db/schemas';
import { and, eq } from 'drizzle-orm';

const DEFAULT_LIMIT = 50;
const DEFAULT_PAGE = 0;

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
		const limit = dto?.options?.limit ?? DEFAULT_LIMIT;
		const page = dto?.options?.page ?? DEFAULT_PAGE;
		const userId = dto?.where?.userId;

		try {
			const result = await this.db
				.select()
				.from(learningPathProgressTable)
				.where(
					and(
						userId ? eq(learningPathProgressTable.userId, userId) : undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);

			return result;
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
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
			throw new RepositoryException('drizzle err', err);
		}
	}

	async findForUser(
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
			throw new RepositoryException('drizzle err', err);
		}
	}
}
