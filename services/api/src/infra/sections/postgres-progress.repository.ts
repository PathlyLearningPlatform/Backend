import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import {
	type ISectionProgressRepository,
	type ListSectionProgressOptions,
	SectionProgress,
	type SectionProgressId,
} from '@/domain/sections';
import type { Db } from '@/infra/db/type';
import { DbService } from '../db/db.service';
import { sectionProgressTable } from '../db/schemas';
import { SectionsApiConstraints } from './enums';

@Injectable()
export class PostgresSectionProgressRepository
	implements ISectionProgressRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async findById(id: SectionProgressId): Promise<SectionProgress | null> {
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

			return SectionProgress.fromDataSource(sectionProgress);
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

	async list(dto?: ListSectionProgressOptions): Promise<SectionProgress[]> {
		const limit = dto?.options?.limit ?? SectionsApiConstraints.DEFAULT_LIMIT;
		const page = dto?.options?.page ?? SectionsApiConstraints.DEFAULT_PAGE;
		const userId = dto?.where?.userId;
		const learningPathId = dto?.where?.learningPathId;

		try {
			const rows = await this.db
				.select()
				.from(sectionProgressTable)
				.where(
					and(
						learningPathId
							? eq(sectionProgressTable.learningPathId, learningPathId)
							: undefined,
						userId ? eq(sectionProgressTable.userId, userId) : undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);

			return rows.map(SectionProgress.fromDataSource);
		} catch (err) {
			throw new DbException('drizzle err', err);
		}
	}
}
