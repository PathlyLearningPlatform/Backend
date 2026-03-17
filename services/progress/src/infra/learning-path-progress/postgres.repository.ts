import {
	LearningPathProgress,
	type ILearningPathProgressRepository,
	type LearningPathProgressId,
} from '@/domain/learning-path-progress';
import { Inject, Injectable } from '@nestjs/common';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { DbService } from '../common/db/db.service';
import type { Db } from '../common/db/types';
import { learningPathProgressTable } from '../common/db/schemas';
import { eq } from 'drizzle-orm';

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
				.where(eq(learningPathProgressTable.id, id.toString()));

			if (!learningPathProgress) {
				return null;
			}

			return LearningPathProgress.fromDataSource({
				id: learningPathProgress.id,
				learningPathId: learningPathProgress.learningPathId,
				userId: learningPathProgress.userId,
				completedAt: learningPathProgress.completedAt,
				completedSectionCount: learningPathProgress.completedSectionCount,
				totalSectionCount: learningPathProgress.totalSectionCount,
			});
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}

	async save(aggregate: LearningPathProgress): Promise<void> {
		try {
			await this.db
				.insert(learningPathProgressTable)
				.values({
					id: aggregate.id.toString(),
					learningPathId: aggregate.learningPathId.toString(),
					userId: aggregate.userId.toString(),
					completedAt: aggregate.completedAt,
					completedSectionCount: aggregate.completedSectionCount,
					totalSectionCount: aggregate.totalSectionCount,
				})
				.onConflictDoUpdate({
					target: learningPathProgressTable.id,
					set: {
						completedAt: aggregate.completedAt,
						completedSectionCount: aggregate.completedSectionCount,
					},
				});
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}

	async remove(id: LearningPathProgressId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(learningPathProgressTable)
				.where(eq(learningPathProgressTable.id, id.toString()));

			return result.rows.length > 0;
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}
}
