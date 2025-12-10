import { Inject, Injectable } from '@nestjs/common';
import { DbException, SortType } from 'common/index.js';
import { asc, desc, eq } from 'drizzle-orm';
import type {
	CreatePathCommand,
	FindOnePathCommand,
	FindPathsCommand,
	RemovePathCommand,
	UpdatePathComand,
} from '@/domain/paths/commands';
import type { Path } from '@/domain/paths/entities';
import type { IPathsRepository } from '@/domain/paths/interfaces';
import type { Db } from '@/infra/common/types';
import { DbService } from '../db/db.service';
import { pathsTable } from '../db/schemas';
import type {
	CreatePathOptions,
	DbPathEntity,
	FindOnePathOptions,
	FindPathsOptions,
	RemovePathOptions,
	UpdatePathOptions,
} from './types';

@Injectable()
export class PathsRepository implements IPathsRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async find(command: FindPathsCommand): Promise<Path[]> {
		const options = this.findCommandToDb(command);
		const limit = options.where?.limit || 100;
		const page = options.where?.page || 0;
		const orderBy = options.where?.orderBy || 'createdAt';
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

			return result.map((item) => this.dbToDomainEntity(item));
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	async findOne(command: FindOnePathCommand): Promise<Path | null> {
		const options = this.findOneCommandToDb(command);

		try {
			const result = await this.db
				.select()
				.from(pathsTable)
				.where(eq(pathsTable.id, options.where.id));

			return result.length <= 0 ? null : this.dbToDomainEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	async create(command: CreatePathCommand): Promise<Path> {
		const options = this.createCommandToDb(command);

		try {
			const result = await this.db
				.insert(pathsTable)
				.values(options)
				.returning();

			return this.dbToDomainEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	async update(command: UpdatePathComand): Promise<Path | null> {
		const options = this.updateCommandToDb(command);

		try {
			const result = await this.db
				.update(pathsTable)
				.set(options.fields || {})
				.where(eq(pathsTable.id, options.where.id))
				.returning();

			return result.length <= 0 ? null : this.dbToDomainEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	async remove(command: RemovePathCommand): Promise<Path | null> {
		const options = this.removeCommandToDb(command);

		try {
			const result = await this.db
				.delete(pathsTable)
				.where(eq(pathsTable.id, options.where.id))
				.returning();

			return result.length <= 0 ? null : this.dbToDomainEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	private dbToDomainEntity(dbEntity: DbPathEntity): Path {
		return {
			...dbEntity,
			createdAt: dbEntity.createdAt.toISOString(),
			updatedAt: dbEntity.updatedAt.toISOString(),
		};
	}
	private findCommandToDb(command: FindPathsCommand): FindPathsOptions {
		return command;
	}
	private findOneCommandToDb(command: FindOnePathCommand): FindOnePathOptions {
		return command;
	}
	private createCommandToDb(command: CreatePathCommand): CreatePathOptions {
		return command;
	}
	private updateCommandToDb(command: UpdatePathComand): UpdatePathOptions {
		return command;
	}
	private removeCommandToDb(command: RemovePathCommand): RemovePathOptions {
		return command;
	}
}
