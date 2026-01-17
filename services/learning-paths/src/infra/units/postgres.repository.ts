import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@pathly-backend/common/index.js';
import { eq, DrizzleQueryError } from 'drizzle-orm';
import type {
	CreateUnitCommand,
	FindOneUnitCommand,
	FindUnitsCommand,
	RemoveUnitCommand,
	UpdateUnitCommand,
} from '@/app/units/commands';
import type { IUnitsRepository } from '@/app/units/interfaces';
import type { Unit } from '@/domain/units/entities';
import type { Db } from '@/infra/common/types';
import { DbService } from '../db/db.service';
import { unitsTable } from '../db/schemas';
import { UnitsApiConstraints } from './enums';
import { dbUnitToEntity } from './helpers';
import { DatabaseError as PostgresError } from 'pg';
import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { InvalidReferenceException } from '@pathly-backend/common/index.js';

/**
 * @description This class is a concrete implementation of IUnitsRepository interface. It's reponsibility is to perform CRUD operations on units using postgres as data source.
 */
@Injectable()
export class PostgresUnitsRepository implements IUnitsRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	/**
	 *
	 * @param command
	 * @returns units array
	 * @throws DbException if there is db error
	 * @description this function retrieves units from database
	 */
	async find(command: FindUnitsCommand): Promise<Unit[]> {
		const limit = command.options?.limit || UnitsApiConstraints.DEFAULT_LIMIT;
		const page = command.options?.page || UnitsApiConstraints.DEFAULT_PAGE;

		try {
			const result = await this.db
				.select()
				.from(unitsTable)
				.limit(limit)
				.offset(page * limit);

			return result.map(dbUnitToEntity);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns unit or null if unit is not found
	 * @throws DbException if there is db error
	 * @description this function retrieves one unit from database
	 */
	async findOne(command: FindOneUnitCommand): Promise<Unit | null> {
		try {
			const result = await this.db
				.select()
				.from(unitsTable)
				.where(eq(unitsTable.id, command.where.id));

			return result.length <= 0 ? null : dbUnitToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns created unit
	 * @throws DbException if there is db error
	 * @description this function creates unit in a database
	 */
	async create(command: CreateUnitCommand): Promise<Unit> {
		try {
			const result = await this.db
				.insert(unitsTable)
				.values(command)
				.returning();

			return dbUnitToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns updated unit or null if unit is not found
	 * @throws DbException if there is db error
	 * @description this function updates unit in a database
	 */
	async update(command: UpdateUnitCommand): Promise<Unit | null> {
		try {
			const result = await this.db
				.update(unitsTable)
				.set(command.fields || {})
				.where(eq(unitsTable.id, command.where.id))
				.returning();

			return result.length <= 0 ? null : dbUnitToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns removed unit or null if unit is not found
	 * @throws DbException if there is db error
	 * @description this function removes unit from a database
	 */
	async remove(command: RemoveUnitCommand): Promise<Unit | null> {
		try {
			const result = await this.db
				.delete(unitsTable)
				.where(eq(unitsTable.id, command.where.id))
				.returning();

			return result.length <= 0 ? null : dbUnitToEntity(result[0]);
		} catch (err) {
			if (err instanceof DrizzleQueryError) {
				if (err.cause instanceof PostgresError) {
					if (err.cause.code === PG_FOREIGN_KEY_VIOLATION) {
						throw new InvalidReferenceException(err.message, err);
					}
				}
			}

			throw new DbException('db error', err, true);
		}
	}
}
