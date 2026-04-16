import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import {
	type ILessonProgressRepository,
	type ListLessonProgressOptions,
	LessonProgress,
	type LessonProgressId,
} from '@/domain/lessons';
import type { Db } from '@/infra/db/type';
import { DbService } from '../db/db.service';
import { lessonProgressTable } from '../db/schemas';
import { LessonsApiConstraints } from './enums';

@Injectable()
export class PostgresLessonProgressRepository
	implements ILessonProgressRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async findById(id: LessonProgressId): Promise<LessonProgress | null> {
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

			return LessonProgress.fromDataSource(lessonProgress);
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async save(aggregate: LessonProgress): Promise<void> {
		try {
			await this.db
				.insert(lessonProgressTable)
				.values({
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
			throw new DbException('drizzle err', err);
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
			throw new DbException('drizzle err', err);
		}
	}

	async list(dto?: ListLessonProgressOptions): Promise<LessonProgress[]> {
		const limit = dto?.options?.limit ?? LessonsApiConstraints.DEFAULT_LIMIT;
		const page = dto?.options?.page ?? LessonsApiConstraints.DEFAULT_PAGE;
		const userId = dto?.where?.userId;
		const unitId = dto?.where?.unitId;

		try {
			const rows = await this.db
				.select()
				.from(lessonProgressTable)
				.where(
					and(
						unitId ? eq(lessonProgressTable.unitId, unitId) : undefined,
						userId ? eq(lessonProgressTable.userId, userId) : undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);

			return rows.map(LessonProgress.fromDataSource);
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}
}
