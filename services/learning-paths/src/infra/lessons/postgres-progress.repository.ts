import { Inject, Injectable } from '@nestjs/common';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { and, eq } from 'drizzle-orm';
import {
	type ILessonProgressRepository,
	LessonProgress,
	type LessonProgressId,
} from '@/domain/lessons';
import type { Db } from '@/infra/common/types';
import { DbService } from '../common/db/db.service';
import { lessonProgressTable } from '../common/db/schemas';

function createProgressId(lessonId: string, userId: string): string {
	return `${lessonId}:${userId}`;
}

@Injectable()
export class PostgresLessonProgressRepository
	implements ILessonProgressRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async load(id: LessonProgressId): Promise<LessonProgress | null> {
		try {
			const [lessonProgress] = await this.db
				.select()
				.from(lessonProgressTable)
				.where(
					and(
						eq(lessonProgressTable.lessonId, id.lessonId.value),
						eq(lessonProgressTable.userId, id.userId.toString()),
					),
				);

			if (!lessonProgress) {
				return null;
			}

			return LessonProgress.fromDataSource({
				lessonId: lessonProgress.lessonId,
				unitId: lessonProgress.unitId,
				userId: lessonProgress.userId,
				completedAt: lessonProgress.completedAt,
				completedActivityCount: lessonProgress.completedActivityCount,
				totalActivityCount: lessonProgress.totalActivityCount,
			});
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}

	async save(aggregate: LessonProgress): Promise<void> {
		try {
			await this.db
				.insert(lessonProgressTable)
				.values({
					id: createProgressId(
						aggregate.lessonId.value,
						aggregate.userId.toString(),
					),
					lessonId: aggregate.lessonId.value,
					unitId: aggregate.unitId.value,
					userId: aggregate.userId.toString(),
					completedAt: aggregate.completedAt,
					completedActivityCount: aggregate.completedActivityCount,
					totalActivityCount: aggregate.totalActivityCount,
				})
				.onConflictDoUpdate({
					target: [lessonProgressTable.lessonId, lessonProgressTable.userId],
					set: {
						completedAt: aggregate.completedAt,
						completedActivityCount: aggregate.completedActivityCount,
					},
				});
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}

	async remove(id: LessonProgressId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(lessonProgressTable)
				.where(
					and(
						eq(lessonProgressTable.lessonId, id.lessonId.value),
						eq(lessonProgressTable.userId, id.userId.toString()),
					),
				);

			return result.rows.length > 0;
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}
}
