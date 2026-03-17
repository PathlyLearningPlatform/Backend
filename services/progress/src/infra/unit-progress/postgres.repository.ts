import {
	UnitProgress,
	type IUnitProgressRepository,
	type UnitProgressId,
} from '@/domain/unit-progress';
import { Inject, Injectable } from '@nestjs/common';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { DbService } from '../common/db/db.service';
import type { Db } from '../common/db/types';
import { unitProgressTable } from '../common/db/schemas';
import { eq } from 'drizzle-orm';

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
				.where(eq(unitProgressTable.id, id.toString()));

			if (!unitProgress) {
				return null;
			}

			return UnitProgress.fromDataSource({
				id: unitProgress.id,
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
					id: aggregate.id.toString(),
					unitId: aggregate.unitId.toString(),
					sectionId: aggregate.sectionId.toString(),
					userId: aggregate.userId.toString(),
					completedAt: aggregate.completedAt,
					completedLessonCount: aggregate.completedLessonCount,
					totalLessonCount: aggregate.totalLessonCount,
				})
				.onConflictDoUpdate({
					target: unitProgressTable.id,
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
				.where(eq(unitProgressTable.id, id.toString()));

			return result.rows.length > 0;
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}
}
