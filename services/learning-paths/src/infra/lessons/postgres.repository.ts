import { Inject, Injectable } from '@nestjs/common';
import { DbException } from '@pathly-backend/common/index.js';
import { eq } from 'drizzle-orm';
import type {
	CreateLessonCommand,
	FindOneLessonCommand,
	FindLessonsCommand,
	RemoveLessonCommand,
	UpdateLessonCommand,
} from '@/app/lessons/commands';
import type { ILessonsRepository } from '@/app/lessons/interfaces';
import type { Lesson } from '@/domain/lessons/entities';
import type { Db } from '@/infra/common/types';
import { DbService } from '../db/db.service';
import { lessonsTable } from '../db/schemas';
import { LessonsApiConstraints } from './enums';
import { dbLessonToEntity } from './helpers';
import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { DrizzleQueryError } from 'drizzle-orm';
import { DatabaseError as PostgresError } from 'pg';
import { InvalidReferenceException } from '@pathly-backend/common/index.js';

/**
 * @description This class is a concrete implementation of ILessonsRepository interface. It's reponsibility is to perform CRUD operations on lessons using postgres as data source.
 */
@Injectable()
export class PostgresLessonsRepository implements ILessonsRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	/**
	 *
	 * @param command
	 * @returns lessons array
	 * @throws DbException if there is db error
	 * @description this function retrieves lessons from database
	 */
	async find(command: FindLessonsCommand): Promise<Lesson[]> {
		const limit = command.options?.limit || LessonsApiConstraints.DEFAULT_LIMIT;
		const page = command.options?.page || LessonsApiConstraints.DEFAULT_PAGE;

		try {
			const result = await this.db
				.select()
				.from(lessonsTable)
				.limit(limit)
				.offset(page * limit);

			return result.map(dbLessonToEntity);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns lesson or null if lesson is not found
	 * @throws DbException if there is db error
	 * @description this function retrieves one lesson from database
	 */
	async findOne(command: FindOneLessonCommand): Promise<Lesson | null> {
		try {
			const result = await this.db
				.select()
				.from(lessonsTable)
				.where(eq(lessonsTable.id, command.where.id));

			return result.length <= 0 ? null : dbLessonToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns created lesson
	 * @throws DbException if there is db error
	 * @description this function creates lesson in a database
	 */
	async create(command: CreateLessonCommand): Promise<Lesson> {
		try {
			const result = await this.db
				.insert(lessonsTable)
				.values(command)
				.returning();

			return dbLessonToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns updated lesson or null if lesson is not found
	 * @throws DbException if there is db error
	 * @description this function updates lesson in a database
	 */
	async update(command: UpdateLessonCommand): Promise<Lesson | null> {
		try {
			const result = await this.db
				.update(lessonsTable)
				.set(command.fields || {})
				.where(eq(lessonsTable.id, command.where.id))
				.returning();

			return result.length <= 0 ? null : dbLessonToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns removed lesson or null if lesson is not found
	 * @throws DbException if there is db error
	 * @description this function removes lesson from a database
	 */
	async remove(command: RemoveLessonCommand): Promise<Lesson | null> {
		try {
			const result = await this.db
				.delete(lessonsTable)
				.where(eq(lessonsTable.id, command.where.id))
				.returning();

			return result.length <= 0 ? null : dbLessonToEntity(result[0]);
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
