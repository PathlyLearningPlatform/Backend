import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@infra/common';
import { and, eq } from 'drizzle-orm';
import type { ListUnitProgressDto, UnitProgressDto } from '@/app/units/dtos';
import type { IUnitProgressReadRepository } from '@/app/units/interfaces';
import type { Db } from '@/infra/db/type';
import { DbService } from '../db/db.service';
import { unitProgressTable } from '../db/schemas';
import { UnitsApiConstraints } from './enums';

@Injectable()
export class PostgresUnitProgressReadRepository
	implements IUnitProgressReadRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(dto?: ListUnitProgressDto): Promise<UnitProgressDto[]> {
		const limit = dto?.options?.limit ?? UnitsApiConstraints.DEFAULT_LIMIT;
		const page = dto?.options?.page ?? UnitsApiConstraints.DEFAULT_PAGE;
		const userId = dto?.where?.userId;
		const sectionId = dto?.where?.sectionId;

		try {
			return await this.db
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
		} catch (err) {
			throw new DbException('drizzle err', err);
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
			throw new DbException('drizzle err', err);
		}
	}

	async findOneForUser(
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
			throw new DbException('drizzle err', err);
		}
	}
}
