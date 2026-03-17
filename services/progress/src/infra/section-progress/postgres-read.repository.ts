import type {
	ListSectionProgressDto,
	SectionProgressDto,
} from '@/app/section-progress/dtos';
import type { ISectionProgressReadRepository } from '@/app/section-progress/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../common/db/db.service';
import type { Db } from '../common/db/types';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { sectionProgressTable } from '../common/db/schemas';
import { and, eq } from 'drizzle-orm';

const DEFAULT_LIMIT = 50;
const DEFAULT_PAGE = 0;

@Injectable()
export class PostgresSectionProgressReadRepository
	implements ISectionProgressReadRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(dto?: ListSectionProgressDto): Promise<SectionProgressDto[]> {
		const limit = dto?.options?.limit ?? DEFAULT_LIMIT;
		const page = dto?.options?.page ?? DEFAULT_PAGE;
		const userId = dto?.where?.userId;
		const learningPathId = dto?.where?.learningPathId;

		try {
			const result = await this.db
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

			return result;
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

	async findForUser(
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
