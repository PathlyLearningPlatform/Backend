import { Inject, Injectable } from '@nestjs/common';
import {
	DbException,
	InvalidReferenceException,
	SortType,
} from '@pathly-backend/common/index.js';
import { asc, desc, eq } from 'drizzle-orm';
import type {
	CreatePathCommand,
	FindOnePathCommand,
	FindPathsCommand,
	RemovePathCommand,
	UpdatePathComand,
} from '@/domain/paths/commands';
import type { Path } from '@/domain/paths/entities';
import { PathsOrderByFields } from '@/domain/paths/enums';
import type { IPathsRepository } from '@/domain/paths/interfaces';
import type { Db } from '@/infra/common/types';
import { DbService } from '../db/db.service';
import { pathsTable } from '../db/schemas';
import { dbPathToEntity } from './helpers';
import { PathsApiConstraints } from './enums';
import { DrizzleQueryError } from 'drizzle-orm';
import { DatabaseError as PostgresError } from 'pg';
import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';

/**
 * @description This class is a concrete implementation of IPathsRepository interface. It's reponsibility is to perform CRUD operations on paths using postgres as data source.
 */
@Injectable()
export class PostgresPathsRepository implements IPathsRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	/**
	 *
	 * @param command
	 * @returns paths array
	 * @throws DbException if there is db error
	 * @description this function retrieves paths from database
	 */
	async find(command: FindPathsCommand): Promise<Path[]> {
		const limit = command.options?.limit || PathsApiConstraints.DEFAULT_LIMIT;
		const page = command.options?.page || PathsApiConstraints.DEFAULT_PAGE;
		const orderBy = command.options?.orderBy || PathsOrderByFields.CREATED_AT;
		const sortType = command.options?.sortType || SortType.DESC;

		try {
			const result = await this.db
				.select()
				.from(pathsTable)
				.orderBy(
					sortType === SortType.ASC
						? asc(pathsTable[orderBy])
						: desc(pathsTable[orderBy]),
				)
				.limit(limit)
				.offset(page * limit);

			return result.map(dbPathToEntity);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns path or null if path is not found
	 * @throws DbException if there is db error
	 * @description this function retrieves one path from database
	 */
	async findOne(command: FindOnePathCommand): Promise<Path | null> {
		try {
			const result = await this.db
				.select()
				.from(pathsTable)
				.where(eq(pathsTable.id, command.where.id));

			return result.length <= 0 ? null : dbPathToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns created path
	 * @throws DbException if there is db error
	 * @description this function creates path in a database
	 */
	async create(command: CreatePathCommand): Promise<Path> {
		try {
			const result = await this.db
				.insert(pathsTable)
				.values(command)
				.returning();

			return dbPathToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns updated path or null if path is not found
	 * @throws DbException if there is db error
	 * @description this function updates path in a database
	 */
	async update(command: UpdatePathComand): Promise<Path | null> {
		try {
			const result = await this.db
				.update(pathsTable)
				.set(command.fields || {})
				.where(eq(pathsTable.id, command.where.id))
				.returning();

			return result.length <= 0 ? null : dbPathToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns removed path or null if path is not found
	 * @throws
	 * {DbException} if there is db error
	 * {InvalidReferenceException} if there is foreign key violation
	 * @description this function removes path from a database
	 */
	async remove(command: RemovePathCommand): Promise<Path | null> {
		try {
			const result = await this.db
				.delete(pathsTable)
				.where(eq(pathsTable.id, command.where.id))
				.returning();

			return result.length <= 0 ? null : dbPathToEntity(result[0]);
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
