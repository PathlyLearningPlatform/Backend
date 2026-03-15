import {
	ILessonProgressRepository,
	LessonProgress,
	LessonProgressId,
} from '@/domain/lesson-progress';
import { Inject, Injectable } from '@nestjs/common';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { DbService } from '../common/db/db.service';
import { Db } from '../common/db/types';
import { lessonProgressTable } from '../common/db/schemas';
import { eq } from 'drizzle-orm';

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
				.where(eq(lessonProgressTable.id, id.toString()));

			if (!lessonProgress) {
				return null;
			}

			return LessonProgress.fromDataSource({
				id: lessonProgress.id,
				lessonId: lessonProgress.lessonId,
				userId: lessonProgress.userId,
				unitId: lessonProgress.unitId,
				completedAt: lessonProgress.completedAt,
				completedActivityCount: lessonProgress.completedActivityCount,
				totalActivityCount: lessonProgress.totalActivityCount,
			});
		} catch (err) {
			throw new RepositoryException('drizzler err', err);
		}
	}

	async save(aggregate: LessonProgress): Promise<void> {
		try {
			await this.db
				.insert(lessonProgressTable)
				.values({
					id: aggregate.id.toString(),
					lessonId: aggregate.lessonId.toString(),
					unitId: aggregate.unitId.toString(),
					userId: aggregate.userId.toString(),
					completedAt: aggregate.completedAt,
					totalActivityCount: aggregate.totalActivityCount,
					completedActivityCount: aggregate.completedActivityCount,
				})
				.onConflictDoUpdate({
					target: lessonProgressTable.id,
					set: {
						completedAt: aggregate.completedAt,
						completedActivityCount: aggregate.completedActivityCount,
					},
				});
		} catch (err) {
			throw new RepositoryException('drizzler err', err);
		}
	}

	async remove(id: LessonProgressId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(lessonProgressTable)
				.where(eq(lessonProgressTable.id, id.toString()));

			return result.rows.length > 0;
		} catch (err) {
			throw new RepositoryException('drizzler err', err);
		}
	}
}
