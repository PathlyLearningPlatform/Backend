import { PG_FOREIGN_KEY_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { Inject, Injectable } from '@nestjs/common';
import {
	DbException,
	InvalidReferenceException,
} from '@pathly-backend/common/index.js';
import { DrizzleQueryError, eq } from 'drizzle-orm';
import { DatabaseError as PostgresError } from 'pg';
import type {
	CreateSectionCommand,
	FindOneSectionCommand,
	FindSectionsCommand,
	RemoveSectionCommand,
	UpdateSectionCommand,
} from '@/app/sections/commands';
import type { ISectionsRepository } from '@/app/sections/interfaces';
import type { Section } from '@/domain/sections/entities';
import type { Db } from '@/infra/common/types';
import { DbService } from '../db/db.service';
import { sectionsTable } from '../db/schemas';
import { SectionsApiConstraints } from './enums';
import { dbSectionToEntity } from './helpers';

/**
 * @description This class is a concrete implementation of ISectionsRepository interface. It's reponsibility is to perform CRUD operations on sections using postgres as data source.
 */
@Injectable()
export class PostgresSectionsRepository implements ISectionsRepository {
	private db: Db;

	constructor(@Inject(DbService) private readonly dbService: DbService) {
		this.db = this.dbService.getDb();
	}

	/**
	 *
	 * @param command
	 * @returns sections array
	 * @throws DbException if there is db error
	 * @description this function retrieves sections from database
	 */
	async find(command: FindSectionsCommand): Promise<Section[]> {
		const limit =
			command.options?.limit || SectionsApiConstraints.DEFAULT_LIMIT;
		const page = command.options?.page || SectionsApiConstraints.DEFAULT_PAGE;

		try {
			const result = await this.db
				.select()
				.from(sectionsTable)
				.limit(limit)
				.offset(page * limit);

			return result.map(dbSectionToEntity);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns section or null if section is not found
	 * @throws DbException if there is db error
	 * @description this function retrieves one section from database
	 */
	async findOne(command: FindOneSectionCommand): Promise<Section | null> {
		try {
			const result = await this.db
				.select()
				.from(sectionsTable)
				.where(eq(sectionsTable.id, command.where.id));

			return result.length <= 0 ? null : dbSectionToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns created section
	 * @throws DbException if there is db error
	 * @description this function creates section in a database
	 */
	async create(command: CreateSectionCommand): Promise<Section> {
		try {
			const result = await this.db
				.insert(sectionsTable)
				.values(command)
				.returning();

			return dbSectionToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns updated section or null if section is not found
	 * @throws DbException if there is db error
	 * @description this function updates section in a database
	 */
	async update(command: UpdateSectionCommand): Promise<Section | null> {
		try {
			const result = await this.db
				.update(sectionsTable)
				.set(command.fields || {})
				.where(eq(sectionsTable.id, command.where.id))
				.returning();

			return result.length <= 0 ? null : dbSectionToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}

	/**
	 *
	 * @param command
	 * @returns removed section or null if section is not found
	 * @throws DbException if there is db error
	 * @description this function removes section from a database
	 */
	async remove(command: RemoveSectionCommand): Promise<Section | null> {
		try {
			const result = await this.db
				.delete(sectionsTable)
				.where(eq(sectionsTable.id, command.where.id))
				.returning();

			return result.length <= 0 ? null : dbSectionToEntity(result[0]);
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
