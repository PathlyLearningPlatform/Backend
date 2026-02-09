import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { Inject, Injectable } from '@nestjs/common';
import {
	InvalidReferenceException,
	RepositoryException,
} from '@pathly-backend/common/index.js';
import { DrizzleQueryError, eq } from 'drizzle-orm';
import { DatabaseError as PostgresError } from 'pg';
import type { IUnitsRepository } from '@/app/units/interfaces';
import type { Unit, UnitQuery } from '@/domain/units/entities';
import type { Db } from '@/infra/common/types';
import { DbService } from '../db/db.service';
import { unitsTable } from '../db/schemas';
import { UnitsApiConstraints } from './enums';
import { dbUnitToEntity } from './helpers';

@Injectable()
export class PostgresUnitsRepository implements IUnitsRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async find(query?: UnitQuery): Promise<Unit[]> {
		const limit = query?.options?.limit ?? UnitsApiConstraints.DEFAULT_LIMIT;
		const page = query?.options?.page ?? UnitsApiConstraints.DEFAULT_PAGE;

		try {
			const result = await this.db
				.select()
				.from(unitsTable)
				.limit(limit)
				.offset(page * limit);

			return result.map(dbUnitToEntity);
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async findOne(id: string): Promise<Unit | null> {
		try {
			const result = await this.db
				.select()
				.from(unitsTable)
				.where(eq(unitsTable.id, id));

			return result.length <= 0 ? null : dbUnitToEntity(result[0]);
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async save(entity: Unit): Promise<void> {
		try {
			await this.db.insert(unitsTable).values(entity).onConflictDoUpdate({
				target: unitsTable.id,
				set: entity,
			});
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async remove(id: string): Promise<boolean> {
		try {
			const result = await this.db
				.delete(unitsTable)
				.where(eq(unitsTable.id, id))
				.returning();

			return result.length > 0;
		} catch (err) {
			if (err instanceof DrizzleQueryError) {
				if (err.cause instanceof PostgresError) {
					if (err.cause.code === PG_FOREIGN_KEY_VIOLATION) {
						throw new InvalidReferenceException(err.message, err);
					}
				}
			}

			throw new RepositoryException('db error', err);
		}
	}
}
