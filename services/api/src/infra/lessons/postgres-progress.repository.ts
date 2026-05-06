import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, asc, eq, getColumns, isNull } from 'drizzle-orm';
import {
	type ILessonProgressRepository,
	type ListLessonProgressOptions,
	LessonProgress,
	type LessonProgressId,
} from '@/domain/lessons';
import { UserId } from '@/domain/common';
import { UnitId } from '@/domain/units';
import type { Db } from '@/infra/db/types';
import { DbService } from '../db/db.service';
import { lessonProgressTable, lessonsTable } from '../db/schemas';
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

	async findCurrent(
		unitId: UnitId,
		userId: UserId,
	): Promise<LessonProgress | null> {
		try {
			const result = await this.db
				.select(getColumns(lessonProgressTable))
				.from(lessonProgressTable)
				.innerJoin(
					lessonsTable,
					eq(lessonsTable.id, lessonProgressTable.lessonId),
				)
				.where(
					and(
						eq(lessonProgressTable.unitId, unitId.value),
						eq(lessonProgressTable.userId, userId.value.value),
						isNull(lessonProgressTable.completedAt),
					),
				)
				.orderBy(asc(lessonsTable.order))
				.limit(1);

			if (result.length === 0) {
				return null;
			}

			return LessonProgress.fromDataSource(result[0]);
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
					createdAt: aggregate.createdAt,
					updatedAt: aggregate.updatedAt,
				})
				.onConflictDoUpdate({
					target: [lessonProgressTable.lessonId, lessonProgressTable.userId],
					set: {
						completedAt: aggregate.completedAt,
						completedActivityCount: aggregate.completedActivityCount,
						updatedAt: aggregate.updatedAt,
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
