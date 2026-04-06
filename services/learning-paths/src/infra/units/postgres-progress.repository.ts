import { Inject, Injectable } from '@nestjs/common';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { and, eq } from 'drizzle-orm';
import {
	type IUnitProgressRepository,
	UnitProgress,
	type UnitProgressId,
} from '@/domain/units';
import type { Db } from '@/infra/common/types';
import { DbService } from '../common/db/db.service';
import { unitProgressTable } from '../common/db/schemas';

function createProgressId(unitId: string, userId: string): string {
	return `${unitId}:${userId}`;
}

@Injectable()
export class PostgresUnitProgressRepository implements IUnitProgressRepository {
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async load(id: UnitProgressId): Promise<UnitProgress | null> {
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

			return UnitProgress.fromDataSource({
				unitId: unitProgress.unitId,
				sectionId: unitProgress.sectionId,
				userId: unitProgress.userId,
				completedAt: unitProgress.completedAt,
				completedLessonCount: unitProgress.completedLessonCount,
				totalLessonCount: unitProgress.totalLessonCount,
			});
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}

	async save(aggregate: UnitProgress): Promise<void> {
		try {
			await this.db
				.insert(unitProgressTable)
				.values({
					id: createProgressId(
						aggregate.unitId.value,
						aggregate.userId.toString(),
					),
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
			throw new RepositoryException('drizzle err', err);
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
			throw new RepositoryException('drizzle err', err);
		}
	}
}
