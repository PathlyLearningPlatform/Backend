import { Inject, Injectable } from '@nestjs/common';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { and, eq } from 'drizzle-orm';
import type {
	ListSectionProgressDto,
	SectionProgressDto,
} from '@/app/sections/dtos';
import type { ISectionProgressReadRepository } from '@/app/sections/interfaces';
import type { Db } from '@/infra/common/types';
import { DbService } from '../common/db/db.service';
import { sectionProgressTable } from '../common/db/schemas';
import { SectionsApiConstraints } from './enums';

@Injectable()
export class PostgresSectionProgressReadRepository
	implements ISectionProgressReadRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(dto?: ListSectionProgressDto): Promise<SectionProgressDto[]> {
		const limit = dto?.options?.limit ?? SectionsApiConstraints.DEFAULT_LIMIT;
		const page = dto?.options?.page ?? SectionsApiConstraints.DEFAULT_PAGE;
		const userId = dto?.where?.userId;
		const learningPathId = dto?.where?.learningPathId;

		try {
			return await this.db
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
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}

	async findById(id: string): Promise<SectionProgressDto | null> {
		try {
			const [sectionProgress] = await this.db
				.select()
				.from(sectionProgressTable)
				.where(eq(sectionProgressTable.id, id));

			return sectionProgress ?? null;
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}

	async findOneForUser(
		sectionId: string,
		userId: string,
	): Promise<SectionProgressDto | null> {
		try {
			const [sectionProgress] = await this.db
				.select()
				.from(sectionProgressTable)
				.where(
					and(
						eq(sectionProgressTable.sectionId, sectionId),
						eq(sectionProgressTable.userId, userId),
					),
				);

			return sectionProgress ?? null;
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}
}
