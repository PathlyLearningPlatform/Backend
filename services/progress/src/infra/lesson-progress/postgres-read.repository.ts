import {
	ListLessonProgressDto,
	LessonProgressDto,
} from '@/app/lesson-progress/dtos';
import { ILessonProgressReadRepository } from '@/app/lesson-progress/interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../common/db/db.service';
import { Db } from '../common/db/types';
import { RepositoryException } from '@pathly-backend/common/index.js';
import { LessonProgressConstraints } from './enums';
import { lessonProgressTable } from '../common/db/schemas';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class PostgresLessonProgressReadRepository
	implements ILessonProgressReadRepository
{
	private readonly db: Db;

	constructor(@Inject(DbService) readonly dbService: DbService) {
		this.db = dbService.getDb();
	}

	async list(dto?: ListLessonProgressDto): Promise<LessonProgressDto[]> {
		const limit =
			dto?.options?.limit ?? LessonProgressConstraints.DEFAULT_LIMIT;
		const page = dto?.options?.page ?? LessonProgressConstraints.DEFAULT_PAGE;
		const userId = dto?.where?.userId;
		const unitId = dto?.where?.unitId;

		try {
			const result = await this.db
				.select()
				.from(lessonProgressTable)
				.where(
					and(
						unitId ? eq(lessonProgressTable.lessonId, unitId) : undefined,
						userId ? eq(lessonProgressTable.userId, userId) : undefined,
					),
				)
				.limit(limit)
				.offset(limit * page);

			return result;
		} catch (err) {
			throw new RepositoryException('drizzler err', err);
		}
	}

	async findById(id: string): Promise<LessonProgressDto | null> {
		try {
			const [lessonProgress] = await this.db
				.select()
				.from(lessonProgressTable)
				.where(eq(lessonProgressTable.id, id));

			return lessonProgress ?? null;
		} catch (err) {
			throw new RepositoryException('drizzler err', err);
		}
	}

	async findForUser(
		lessonId: string,
		userId: string,
	): Promise<LessonProgressDto | null> {
		try {
			const [lessonProgress] = await this.db
				.select()
				.from(lessonProgressTable)
				.where(
					and(
						eq(lessonProgressTable.lessonId, lessonId),
						eq(lessonProgressTable.userId, userId),
					),
				);

			return lessonProgress ?? null;
		} catch (err) {
			throw new RepositoryException('drizzler err', err);
		}
	}
}
