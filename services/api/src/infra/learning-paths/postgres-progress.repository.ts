import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import {
	type ILearningPathProgressRepository,
	LearningPathProgress,
	type LearningPathProgressId,
	ListLearningPathProgressOptions,
} from '@/domain/learning-paths';
import type { Db } from '@/infra/db/type';
import { DbService } from '../db/db.service';
import { learningPathProgressTable } from '../db/schemas';
import { LearningPathsApiConstraints } from './enums';

@Injectable()
export class PostgresLearningPathProgressRepository
	implements ILearningPathProgressRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async findById(
		id: LearningPathProgressId,
	): Promise<LearningPathProgress | null> {
		try {
			const [learningPathProgress] = await this.db
				.select()
				.from(learningPathProgressTable)
				.where(
					and(
						eq(
							learningPathProgressTable.learningPathId,
							id.learningPathId.toString(),
						),
						eq(learningPathProgressTable.userId, id.userId.toString()),
					),
				);

			if (!learningPathProgress) {
				return null;
			}

			return LearningPathProgress.fromDataSource(learningPathProgress);
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async save(aggregate: LearningPathProgress): Promise<void> {
		try {
			await this.db
				.insert(learningPathProgressTable)
				.values({
					learningPathId: aggregate.learningPathId.toString(),
					userId: aggregate.userId.toString(),
					completedAt: aggregate.completedAt,
					completedSectionCount: aggregate.completedSectionCount,
					totalSectionCount: aggregate.totalSectionCount,
				})
				.onConflictDoUpdate({
					target: [
						learningPathProgressTable.learningPathId,
						learningPathProgressTable.userId,
					],
					set: {
						completedAt: aggregate.completedAt,
						completedSectionCount: aggregate.completedSectionCount,
					},
				});
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async remove(id: LearningPathProgressId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(learningPathProgressTable)
				.where(
					and(
						eq(
							learningPathProgressTable.learningPathId,
							id.learningPathId.toString(),
						),
						eq(learningPathProgressTable.userId, id.userId.toString()),
					),
				);

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async list(
		dto?: ListLearningPathProgressOptions,
	): Promise<LearningPathProgress[]> {
		const limit =
			dto?.options?.limit ?? LearningPathsApiConstraints.DEFAULT_LIMIT;
		const page = dto?.options?.page ?? LearningPathsApiConstraints.DEFAULT_PAGE;
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

			return result.map(LearningPathProgress.fromDataSource);
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}
}
