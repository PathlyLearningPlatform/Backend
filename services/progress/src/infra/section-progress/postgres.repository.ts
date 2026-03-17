import {
	SectionProgress,
	type ISectionProgressRepository,
	type SectionProgressId,
} from '@/domain/section-progress';
import { Inject, Injectable } from '@nestjs/common';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { DbService } from '../common/db/db.service';
import type { Db } from '../common/db/types';
import { sectionProgressTable } from '../common/db/schemas';
import { eq } from 'drizzle-orm';

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
				.where(eq(sectionProgressTable.id, id.toString()));

			if (!sectionProgress) {
				return null;
			}

			return SectionProgress.fromDataSource({
				id: sectionProgress.id,
				sectionId: sectionProgress.sectionId,
				learningPathId: sectionProgress.learningPathId,
				userId: sectionProgress.userId,
				completedAt: sectionProgress.completedAt,
				completedUnitCount: sectionProgress.completedUnitCount,
				totalUnitCount: sectionProgress.totalUnitCount,
			});
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}

	async save(aggregate: SectionProgress): Promise<void> {
		try {
			await this.db
				.insert(sectionProgressTable)
				.values({
					id: aggregate.id.toString(),
					sectionId: aggregate.sectionId.toString(),
					learningPathId: aggregate.learningPathId.toString(),
					userId: aggregate.userId.toString(),
					completedAt: aggregate.completedAt,
					completedUnitCount: aggregate.completedUnitCount,
					totalUnitCount: aggregate.totalUnitCount,
				})
				.onConflictDoUpdate({
					target: sectionProgressTable.id,
					set: {
						completedAt: aggregate.completedAt,
						completedUnitCount: aggregate.completedUnitCount,
					},
				});
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}

	async remove(id: SectionProgressId): Promise<boolean> {
		try {
			const result = await this.db
				.delete(sectionProgressTable)
				.where(eq(sectionProgressTable.id, id.toString()));

			return result.rows.length > 0;
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}
}
