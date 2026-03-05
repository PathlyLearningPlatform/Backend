import { ILessonProgressRepository } from '@/app/lesson-progress/interfaces';
import { LessonProgressFilter } from '@/app/lesson-progress/types';
import { DomainEvent } from '@/domain/common';
import { LessonProgress } from '@/domain/lesson-progress/entities';
import { Inject, Injectable } from '@nestjs/common';
import { RepositoryException } from '@pathly-backend/core';
import { LessonProgressConstraints } from './enums';
import { DbService } from '@infra/common/modules/db/db.service';
import { Db } from '../common/modules/db/types';
import { lessonProgressTable } from '../common/modules/db/schemas';
import { and, eq } from 'drizzle-orm';
import { dbLessonProgressToEntity } from './helpers';

@Injectable()
export class PostgresLessonProgressRepository
	implements ILessonProgressRepository
{
	private db: Db;

	constructor(@Inject() readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(filter?: LessonProgressFilter): Promise<LessonProgress[]> {
		const limit =
			filter?.options?.limit ?? LessonProgressConstraints.DEFAULT_LIMIT;
		const page =
			filter?.options?.page ?? LessonProgressConstraints.DEFAULT_PAGE;
		const userId = filter?.where?.userId;

		try {
			const result = await this.db
				.select()
				.from(lessonProgressTable)
				.where(userId ? eq(lessonProgressTable.userId, userId) : undefined)
				.offset(page * limit)
				.limit(limit);

			return result.map(dbLessonProgressToEntity);
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async findById(id: string): Promise<LessonProgress | null> {
		try {
			const result = await this.db
				.select()
				.from(lessonProgressTable)
				.where(eq(lessonProgressTable.id, id));

			return result.length > 0 ? dbLessonProgressToEntity(result[0]) : null;
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}
	async findOneForUser(
		lessonId: string,
		userId: string,
	): Promise<LessonProgress | null> {
		try {
			const result = await this.db
				.select()
				.from(lessonProgressTable)
				.where(
					and(
						eq(lessonProgressTable.lessonId, lessonId),
						eq(lessonProgressTable.userId, userId),
					),
				);

			return result.length > 0 ? dbLessonProgressToEntity(result[0]) : null;
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async save(entity: LessonProgress): Promise<DomainEvent[]> {
		try {
			await this.db
				.insert(lessonProgressTable)
				.values({
					totalActivityCount: entity.totalActivityCount,
					lessonId: entity.lessonId,
					completedActivityCount: entity.completedActivityCount,
					id: entity.id,
					userId: entity.userId,
					completedAt: entity.completedAt,
				})
				.onConflictDoUpdate({
					target: [lessonProgressTable.id],
					set: {
						completedAt: entity.completedAt,
						completedActivityCount: entity.completedActivityCount,
					},
				});

			return entity.events;
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}

	async removeById(id: string): Promise<boolean> {
		try {
			const result = await this.db
				.delete(lessonProgressTable)
				.where(eq(lessonProgressTable.id, id))
				.returning();

			return result.length > 0;
		} catch (err) {
			throw new RepositoryException('db error', err);
		}
	}
}
