import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import {
	type ILearningPathProgressRepository,
	LearningPathProgress,
	type LearningPathProgressId,
} from '@/domain/learning-paths';
import type { Db } from '@/infra/db/type';
import { DbService } from '../db/db.service';
import { learningPathProgressTable } from '../db/schemas';

@Injectable()
export class PostgresLearningPathProgressRepository
	implements ILearningPathProgressRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async load(id: LearningPathProgressId): Promise<LearningPathProgress | null> {
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

			return LearningPathProgress.fromDataSource({
				learningPathId: learningPathProgress.learningPathId,
				userId: learningPathProgress.userId,
				completedAt: learningPathProgress.completedAt,
				completedSectionCount: learningPathProgress.completedSectionCount,
				totalSectionCount: learningPathProgress.totalSectionCount,
			});
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
}
