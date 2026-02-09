import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { Inject, Injectable } from '@nestjs/common';
import {
	InvalidReferenceException,
	RepositoryException,
} from '@pathly-backend/common/index.js';
import { DrizzleQueryError, eq } from 'drizzle-orm';
import { DatabaseError as PostgresError } from 'pg';
import type { ISectionsRepository } from '@/app/sections/interfaces';
import type { Section, SectionQuery } from '@/domain/sections/entities';
import type { Db } from '@/infra/common/types';
import { DbService } from '../db/db.service';
import { sectionsTable } from '../db/schemas';
import { SectionsApiConstraints } from './enums';
import { dbSectionToEntity } from './helpers';

@Injectable()
export class PostgresSectionsRepository implements ISectionsRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	async find(query?: SectionQuery): Promise<Section[]> {
		const limit = query?.options?.limit ?? SectionsApiConstraints.DEFAULT_LIMIT;
		const page = query?.options?.page ?? SectionsApiConstraints.DEFAULT_PAGE;

		try {
			const result = await this.db
				.select()
				.from(sectionsTable)
				.limit(limit)
				.offset(page * limit);

			return result.map(dbSectionToEntity);
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async findOne(id: string): Promise<Section | null> {
		try {
			const result = await this.db
				.select()
				.from(sectionsTable)
				.where(eq(sectionsTable.id, id));

			return result.length <= 0 ? null : dbSectionToEntity(result[0]);
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async save(entity: Section): Promise<void> {
		try {
			await this.db.insert(sectionsTable).values(entity).onConflictDoUpdate({
				target: sectionsTable.id,
				set: entity,
			});
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async remove(id: string): Promise<boolean> {
		try {
			const result = await this.db
				.delete(sectionsTable)
				.where(eq(sectionsTable.id, id))
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
