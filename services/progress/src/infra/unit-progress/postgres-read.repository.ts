import type {
	ListUnitProgressDto,
	UnitProgressDto,
} from '@/app/unit-progress/dtos';
import type { IUnitProgressReadRepository } from '@/app/unit-progress/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../common/db/db.service';
import type { Db } from '../common/db/types';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { unitProgressTable } from '../common/db/schemas';
import { and, eq } from 'drizzle-orm';

const DEFAULT_LIMIT = 50;
const DEFAULT_PAGE = 0;

@Injectable()
export class PostgresUnitProgressReadRepository
	implements IUnitProgressReadRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(dto?: ListUnitProgressDto): Promise<UnitProgressDto[]> {
		const limit = dto?.options?.limit ?? DEFAULT_LIMIT;
		const page = dto?.options?.page ?? DEFAULT_PAGE;
		const userId = dto?.where?.userId;
		const sectionId = dto?.where?.sectionId;

		try {
			const result = await this.db
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

			return result;
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}

	async findById(id: string): Promise<UnitProgressDto | null> {
		try {
			const [unitProgress] = await this.db
				.select()
				.from(unitProgressTable)
				.where(eq(unitProgressTable.id, id));

			return unitProgress ?? null;
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}

	async findForUser(
		unitId: string,
		userId: string,
	): Promise<UnitProgressDto | null> {
		try {
			const [unitProgress] = await this.db
				.select()
				.from(unitProgressTable)
				.where(
					and(
						eq(unitProgressTable.unitId, unitId),
						eq(unitProgressTable.userId, userId),
					),
				);

			return unitProgress ?? null;
		} catch (err) {
			throw new RepositoryException('drizzle err', err);
		}
	}
}
