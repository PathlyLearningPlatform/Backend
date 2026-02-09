import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { Inject, Injectable } from '@nestjs/common';
import {
	InvalidReferenceException,
	RepositoryException,
} from '@pathly-backend/common/index.js';
import { DrizzleQueryError, eq } from 'drizzle-orm';
import { DatabaseError as PostgresError } from 'pg';
import type { ILessonsRepository } from '@/app/lessons/interfaces';
import type { Lesson, LessonQuery } from '@/domain/lessons/entities';
import type { Db } from '@/infra/common/types';
import { DbService } from '../db/db.service';
import { lessonsTable } from '../db/schemas';
import { LessonsApiConstraints } from './enums';
import { dbLessonToEntity } from './helpers';

@Injectable()
export class PostgresLessonsRepository implements ILessonsRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async find(query?: LessonQuery): Promise<Lesson[]> {
		const limit = query?.options?.limit ?? LessonsApiConstraints.DEFAULT_LIMIT;
		const page = query?.options?.page ?? LessonsApiConstraints.DEFAULT_PAGE;

		try {
			const result = await this.db
				.select()
				.from(lessonsTable)
				.limit(limit)
				.offset(page * limit);

			return result.map(dbLessonToEntity);
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async findOne(id: string): Promise<Lesson | null> {
		try {
			const result = await this.db
				.select()
				.from(lessonsTable)
				.where(eq(lessonsTable.id, id));

			return result.length <= 0 ? null : dbLessonToEntity(result[0]);
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async save(entity: Lesson): Promise<void> {
		try {
			await this.db.insert(lessonsTable).values(entity).onConflictDoUpdate({
				target: lessonsTable.id,
				set: entity,
			});
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async remove(id: string): Promise<boolean> {
		try {
			const result = await this.db
				.delete(lessonsTable)
				.where(eq(lessonsTable.id, id))
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
