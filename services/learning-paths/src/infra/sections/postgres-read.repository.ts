import * as schema from '@/infra/db/schemas';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { SectionDto } from '@/app/sections/dtos';
import type { ISectionReadRepository } from '@/app/sections/interfaces';
import { DbService } from '../db/db.service';
import { SectionsApiConstraints } from './enums';

@Injectable()
export class PostgresSectionReadRepository implements ISectionReadRepository {
	private readonly db: NodePgDatabase<typeof schema>;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(
		filter?: Parameters<ISectionReadRepository['list']>[0],
	): Promise<SectionDto[]> {
		const limit =
			filter?.options?.limit ?? SectionsApiConstraints.DEFAULT_LIMIT;
		const page = filter?.options?.page ?? SectionsApiConstraints.DEFAULT_PAGE;
		const learningPathId = filter?.where?.learningPathId;

		const sections = await this.db
			.select()
			.from(schema.sectionsTable)
			.where(
				learningPathId
					? eq(schema.sectionsTable.learningPathId, learningPathId)
					: undefined,
			)
			.limit(limit)
			.offset(page * limit);

		return sections;
	}

	async findById(id: string): Promise<SectionDto | null> {
		const [section] = await this.db
			.select()
			.from(schema.sectionsTable)
			.where(eq(schema.sectionsTable.id, id));

		return section ?? null;
	}
}
