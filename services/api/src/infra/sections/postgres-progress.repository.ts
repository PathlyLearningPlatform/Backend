import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import {
	type ISectionProgressRepository,
	SectionProgress,
	type SectionProgressId,
} from '@/domain/sections';
import type { Db } from '@/infra/db/type';
import { DbService } from '../db/db.service';
import { sectionProgressTable } from '../db/schemas';

@Injectable()
export class PostgresSectionProgressRepository
	implements ISectionProgressRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async load(id: SectionProgressId): Promise<SectionProgress | null> {
		try {
			const [sectionProgress] = await this.db
				.select()
				.from(sectionProgressTable)
				.where(
					and(
						eq(sectionProgressTable.sectionId, id.sectionId.value),
						eq(sectionProgressTable.userId, id.userId.toString()),
					),
				);

			if (!sectionProgress) {
				return null;
			}

			return SectionProgress.fromDataSource({
				sectionId: sectionProgress.sectionId,
				learningPathId: sectionProgress.learningPathId,
				userId: sectionProgress.userId,
				completedAt: sectionProgress.completedAt,
				completedUnitCount: sectionProgress.completedUnitCount,
				totalUnitCount: sectionProgress.totalUnitCount,
			});
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async save(aggregate: SectionProgress): Promise<void> {
		try {
			await this.db
				.insert(sectionProgressTable)
				.values({
					sectionId: aggregate.sectionId.value,
					learningPathId: aggregate.learningPathId.toString(),
					userId: aggregate.userId.toString(),
					completedAt: aggregate.completedAt,
					completedUnitCount: aggregate.completedUnitCount,
					totalUnitCount: aggregate.totalUnitCount,
				})
				.onConflictDoUpdate({
					target: [sectionProgressTable.sectionId, sectionProgressTable.userId],
					set: {
						completedAt: aggregate.completedAt,
						completedUnitCount: aggregate.completedUnitCount,
					},
				});
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}

	async remove(id: SectionProgressId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(sectionProgressTable)
				.where(
					and(
						eq(sectionProgressTable.sectionId, id.sectionId.value),
						eq(sectionProgressTable.userId, id.userId.toString()),
					),
				);

			return result.rows.length > 0;
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}
}
