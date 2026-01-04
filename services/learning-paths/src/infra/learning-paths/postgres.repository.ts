import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { Inject, Injectable } from '@nestjs/common';
import {
	DbException,
	InvalidReferenceException,
	SortType,
} from '@pathly-backend/common/index.js';
import { asc, DrizzleQueryError, desc, eq } from 'drizzle-orm';
import { DatabaseError as PostgresError } from 'pg';
import type {
	CreateLearningPathCommand,
	FindLearningPathsCommand,
	FindOneLearningPathCommand,
	RemoveLearningPathCommand,
	UpdateLearningPathCommand,
} from '@/app/learning-paths/commands';
import type { ILearningPathsRepository } from '@/app/learning-paths/interfaces';
import type { LearningPath } from '@/domain/learning-paths/entities';
import { LearningPathsOrderByFields } from '@/domain/learning-paths/enums';
import type { Db } from '@/infra/common/types';
import { DbService } from '../db/db.service';
import { learningPathsTable } from '../db/schemas';
import { LearningPathsApiConstraints } from './enums';
import { dbPathToEntity } from './helpers';

/**
 * @description This class is a concrete implementation of IPathsRepository interface. It's reponsibility is to perform CRUD operations on paths using postgres as data source.
 */
@Injectable()
export class PostgresLearningPathsRepository
	implements ILearningPathsRepository
{
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
	async find(command: FindLearningPathsCommand): Promise<LearningPath[]> {
		const limit =
			command.options?.limit || LearningPathsApiConstraints.DEFAULT_LIMIT;
		const page =
			command.options?.page || LearningPathsApiConstraints.DEFAULT_PAGE;
		const orderBy =
			command.options?.orderBy || LearningPathsOrderByFields.CREATED_AT;
		const sortType = command.options?.sortType || SortType.DESC;

		try {
			const result = await this.db
				.select()
				.from(learningPathsTable)
				.orderBy(
					sortType === SortType.ASC
						? asc(learningPathsTable[orderBy])
						: desc(learningPathsTable[orderBy]),
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
	async findOne(
		command: FindOneLearningPathCommand,
	): Promise<LearningPath | null> {
		try {
			const result = await this.db
				.select()
				.from(learningPathsTable)
				.where(eq(learningPathsTable.id, command.where.id));

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
	async create(command: CreateLearningPathCommand): Promise<LearningPath> {
		try {
			const result = await this.db
				.insert(learningPathsTable)
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
	async update(
		command: UpdateLearningPathCommand,
	): Promise<LearningPath | null> {
		try {
			const result = await this.db
				.update(learningPathsTable)
				.set(command.fields || {})
				.where(eq(learningPathsTable.id, command.where.id))
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
	async remove(
		command: RemoveLearningPathCommand,
	): Promise<LearningPath | null> {
		try {
			const result = await this.db
				.delete(learningPathsTable)
				.where(eq(learningPathsTable.id, command.where.id))
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
