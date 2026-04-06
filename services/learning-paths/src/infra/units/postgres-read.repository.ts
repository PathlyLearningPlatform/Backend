import * as schema from '@infra/common/db/schemas';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { UnitDto } from '@/app/units/dtos';
import type { IUnitReadRepository } from '@/app/units/interfaces';
import { DbService } from '../common/db/db.service';
import { UnitsApiConstraints } from './enums';

@Injectable()
export class PostgresUnitReadRepository implements IUnitReadRepository {
	private readonly db: NodePgDatabase<typeof schema>;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(
		filter?: Parameters<IUnitReadRepository['list']>[0],
	): Promise<UnitDto[]> {
		const limit = filter?.options?.limit ?? UnitsApiConstraints.DEFAULT_LIMIT;
		const page = filter?.options?.page ?? UnitsApiConstraints.DEFAULT_PAGE;
		const sectionId = filter?.where?.sectionId;

		const units = await this.db
			.select()
			.from(schema.unitsTable)
			.where(sectionId ? eq(schema.unitsTable.sectionId, sectionId) : undefined)
			.limit(limit)
			.offset(page * limit);

		return units;
	}

	async findById(id: string): Promise<UnitDto | null> {
		const [unit] = await this.db
			.select()
			.from(schema.unitsTable)
			.where(eq(schema.unitsTable.id, id));

		return unit ?? null;
	}
}
