import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, asc, eq, getColumns, isNull } from 'drizzle-orm';
import {
	type IUnitProgressRepository,
	type ListUnitProgressOptions,
	UnitProgress,
	type UnitProgressId,
} from '@/domain/units';
import { UserId } from '@/domain/common';
import { SectionId } from '@/domain/sections';
import type { Db } from '@/infra/db/types';
import { DbService } from '../db/db.service';
import { unitProgressTable, unitsTable } from '../db/schemas';
import { UnitsApiConstraints } from './enums';

@Injectable()
export class PostgresUnitProgressRepository implements IUnitProgressRepository {
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async findById(id: UnitProgressId): Promise<UnitProgress | null> {
		try {
			const [unitProgress] = await this.db
				.select()
				.from(unitProgressTable)
				.where(
					and(
						eq(unitProgressTable.unitId, id.unitId.value),
						eq(unitProgressTable.userId, id.userId.toString()),
					),
				);

			if (!unitProgress) {
				return null;
			}

			return UnitProgress.fromDataSource(unitProgress);
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async findCurrent(
		sectionId: SectionId,
		userId: UserId,
	): Promise<UnitProgress | null> {
		try {
			const result = await this.db
				.select(getColumns(unitProgressTable))
				.from(unitProgressTable)
				.innerJoin(unitsTable, eq(unitsTable.id, unitProgressTable.unitId))
				.where(
					and(
						eq(unitProgressTable.sectionId, sectionId.value),
						eq(unitProgressTable.userId, userId.value.value),
						isNull(unitProgressTable.completedAt),
					),
				)
				.orderBy(asc(unitsTable.order))
				.limit(1);

			if (result.length === 0) {
				return null;
			}

			return UnitProgress.fromDataSource(result[0]);
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async save(aggregate: UnitProgress): Promise<void> {
		try {
			await this.db
				.insert(unitProgressTable)
				.values({
					unitId: aggregate.unitId.value,
					sectionId: aggregate.sectionId.value,
					userId: aggregate.userId.toString(),
					completedAt: aggregate.completedAt,
					completedLessonCount: aggregate.completedLessonCount,
					totalLessonCount: aggregate.totalLessonCount,
				})
				.onConflictDoUpdate({
					target: [unitProgressTable.unitId, unitProgressTable.userId],
					set: {
						completedAt: aggregate.completedAt,
						completedLessonCount: aggregate.completedLessonCount,
					},
				});
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async remove(id: UnitProgressId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(unitProgressTable)
				.where(
					and(
						eq(unitProgressTable.unitId, id.unitId.value),
						eq(unitProgressTable.userId, id.userId.toString()),
					),
				);

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async list(dto?: ListUnitProgressOptions): Promise<UnitProgress[]> {
		const limit = dto?.options?.limit ?? UnitsApiConstraints.DEFAULT_LIMIT;
		const page = dto?.options?.page ?? UnitsApiConstraints.DEFAULT_PAGE;
		const userId = dto?.where?.userId;
		const sectionId = dto?.where?.sectionId;

		try {
			const rows = await this.db
				.select()
				.from(unitProgressTable)
				.where(
					and(
						sectionId ? eq(unitProgressTable.sectionId, sectionId) : undefined,
						userId ? eq(unitProgressTable.userId, userId) : undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);

			return rows.map(UnitProgress.fromDataSource);
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}
}
