import { Inject, Injectable } from '@nestjs/common';
import { DbException, SortType } from '@pathly-backend/common/index.js';
import { asc, desc, eq } from 'drizzle-orm';
import type {
	CreateSectionCommand,
	FindOneSectionCommand,
	FindSectionsCommand,
	RemoveSectionCommand,
	UpdateSectionComand,
} from '@/domain/sections/commands';
import type { Section } from '@/domain/sections/entities';
import type { ISectionsRepository } from '@/domain/sections/interfaces';
import type { Db } from '@/infra/common/types';
import { DbService } from '../db/db.service';
import { sectionsTable } from '../db/schemas';
import {
	createSectionCommandToDb,
	dbSectionToEntity,
	findOneSectionCommandToDb,
	findSectionsCommandToDb,
	removeSectionCommandToDb,
	updateSectionCommandToDb,
} from './helpers';
import { SectionsApiConstraints } from './enums';

/**
 * @description This class is a concrete implementation of ISectionsRepository interface. It's reponsibility is to perform CRUD operations on sections using postgres as data source.
 */
@Injectable()
export class SectionsRepository implements ISectionsRepository {
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
		const options = findSectionsCommandToDb(command);
		const limit =
			options.options?.limit || SectionsApiConstraints.DEFAULT_LIMIT;
		const page = options.options?.page || SectionsApiConstraints.DEFAULT_PAGE;

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
		const options = findOneSectionCommandToDb(command);

		try {
			const result = await this.db
				.select()
				.from(sectionsTable)
				.where(eq(sectionsTable.id, options.where.id));

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
		const options = createSectionCommandToDb(command);

		try {
			const result = await this.db
				.insert(sectionsTable)
				.values(options)
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
	async update(command: UpdateSectionComand): Promise<Section | null> {
		const options = updateSectionCommandToDb(command);

		try {
			const result = await this.db
				.update(sectionsTable)
				.set(options.fields || {})
				.where(eq(sectionsTable.id, options.where.id))
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
		const options = removeSectionCommandToDb(command);

		try {
			const result = await this.db
				.delete(sectionsTable)
				.where(eq(sectionsTable.id, options.where.id))
				.returning();

			return result.length <= 0 ? null : dbSectionToEntity(result[0]);
		} catch (err) {
			throw new DbException('db error', err, true);
		}
	}
}
