import { Inject, Injectable } from '@nestjs/common';
import { DbException, SortType } from '@pathly-backend/common/index.js';
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
import {
	removePathCommandToDb,
	createPathCommandToDb,
	dbPathToEntity,
	findOnePathCommandToDb,
	findPathsCommandToDb,
	updatePathCommandToDb,
} from './helpers';

@Injectable()
export class PathsRepository implements IPathsRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async find(command: FindPathsCommand): Promise<Path[]> {
		const options = findPathsCommandToDb(command);
		const limit = options.where?.limit || 100;
		const page = options.where?.page || 0;
		const orderBy = options.where?.orderBy || PathsOrderByFields.CREATED_AT;
		const sortType = options.where?.sortType || SortType.DESC;

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

	async findOne(command: FindOnePathCommand): Promise<Path | null> {
		const options = findOnePathCommandToDb(command);

		try {
			const result = await this.db
				.select()
				.from(pathsTable)
				.where(eq(pathsTable.id, options.where.id));

			return result.length <= 0 ? null : dbPathToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	async create(command: CreatePathCommand): Promise<Path> {
		const options = createPathCommandToDb(command);

		try {
			const result = await this.db
				.insert(pathsTable)
				.values(options)
				.returning();

			return dbPathToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	async update(command: UpdatePathComand): Promise<Path | null> {
		const options = updatePathCommandToDb(command);

		try {
			const result = await this.db
				.update(pathsTable)
				.set(options.fields || {})
				.where(eq(pathsTable.id, options.where.id))
				.returning();

			return result.length <= 0 ? null : dbPathToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	async remove(command: RemovePathCommand): Promise<Path | null> {
		const options = removePathCommandToDb(command);

		try {
			const result = await this.db
				.delete(pathsTable)
				.where(eq(pathsTable.id, options.where.id))
				.returning();

			return result.length <= 0 ? null : dbPathToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}
}
