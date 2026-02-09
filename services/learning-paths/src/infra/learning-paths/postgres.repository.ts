import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { Inject, Injectable } from '@nestjs/common';
import {
	InvalidReferenceException,
	RepositoryException,
	SortType,
} from '@pathly-backend/common/index.js';
import { asc, DrizzleQueryError, desc, eq } from 'drizzle-orm';
import { DatabaseError as PostgresError } from 'pg';
import type { CreateLearningPathCommand } from '@/app/learning-paths/commands';
import type { ILearningPathsRepository } from '@/app/learning-paths/interfaces';
import type {
	LearningPath,
	LearningPathQuery,
} from '@/domain/learning-paths/entities';
import { LearningPathsOrderByFields } from '@/domain/learning-paths/enums';
import type { Db } from '@/infra/common/types';
import { DbService } from '../db/db.service';
import { learningPathsTable } from '../db/schemas';
import { LearningPathsApiConstraints } from './enums';
import { dbLearningPathToEntity } from './helpers';

@Injectable()
export class PostgresLearningPathsRepository
	implements ILearningPathsRepository
{
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async find(query?: LearningPathQuery): Promise<LearningPath[]> {
		const limit =
			query?.options?.limit ?? LearningPathsApiConstraints.DEFAULT_LIMIT;
		const page =
			query?.options?.page ?? LearningPathsApiConstraints.DEFAULT_PAGE;
		const orderBy =
			query?.options?.orderBy ?? LearningPathsOrderByFields.CREATED_AT;
		const sortType = query?.options?.sortType || SortType.DESC;

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

			return result.map(dbLearningPathToEntity);
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async findOne(id: string): Promise<LearningPath | null> {
		try {
			const result = await this.db
				.select()
				.from(learningPathsTable)
				.where(eq(learningPathsTable.id, id));

			return result.length <= 0 ? null : dbLearningPathToEntity(result[0]);
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async save(entity: LearningPath): Promise<void> {
		try {
			await this.db
				.insert(learningPathsTable)
				.values(entity)
				.onConflictDoUpdate({
					target: learningPathsTable.id,
					set: entity,
				});
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async remove(id: string): Promise<boolean> {
		try {
			const result = await this.db
				.delete(learningPathsTable)
				.where(eq(learningPathsTable.id, id))
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
